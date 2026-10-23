const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const enums = require('../enums');
const { fileUpload } = require('../config/file');
const fileQuery = require('../queries/fileQuery');

const FILE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Module and field names become folder names, so they must not be able to leave the uploads folder.
const FOLDER_NAME_PATTERN = /^[\w-]+$/;

function isFileId(value) {
  return typeof value === 'string' && FILE_ID_PATTERN.test(value);
}

function getFileFields(fields) {
  return fields.filter(field => field.inputType === enums.inputType.file);
}

function getFolder(...names) {
  if (!names.every(name => FOLDER_NAME_PATTERN.test(name))) {
    throw new Error(`${enums.statusCode.BAD_REQUEST}:Invalid folder name ${names.join('/')}`);
  }
  return path.posix.join(fileUpload.storage, ...names);
}

function getExtension(fileName) {
  const extension = path
    .extname(fileName)
    .slice(1)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  return extension ? `.${extension}` : '';
}

async function moveFile(from, to) {
  await fs.mkdir(path.dirname(to), { recursive: true });

  try {
    await fs.rename(from, to);
  } catch (error) {
    // rename cannot cross devices, e.g. when the uploads folder is a mounted volume.
    if (error.code !== 'EXDEV') throw error;
    await fs.copyFile(from, to);
    await fs.rm(from, { force: true });
  }
}

// A file left behind is harmless, so a failed removal does not fail the request.
async function removeFromDisk(paths) {
  await Promise.allSettled(paths.map(target => fs.rm(target, { recursive: true, force: true })));
}

/**
 * Keeps the files on the disk in step with a transaction: files written during the request are
 * removed again on rollback, and files of deleted records are only removed after commit.
 */
function createFileChanges(transaction) {
  const added = [];
  const removed = [];

  return {
    /**
     * Moves the files uploaded for a row (multipart parts named after their field) into
     * uploads/<module>/<field>/<file id>.<extension>, records them and puts their ids in `data`.
     * Otherwise a file field may only keep its current file or be emptied, so a row cannot
     * point at the file of another row.
     */
    async save(module, fields, uploads, data, oldData) {
      const fileFields = getFileFields(fields);
      const records = [];

      for (const upload of uploads || []) {
        const field = fileFields.find(fileField => fileField.name === upload.fieldname);

        if (!field) {
          throw new Error(
            `${enums.statusCode.BAD_REQUEST}:${upload.fieldname} is not a file field`,
          );
        }
        if (records.some(record => record.fieldName === field.name)) {
          throw new Error(`${enums.statusCode.BAD_REQUEST}:${field.label} accepts one file`);
        }

        const id = randomUUID();
        const filePath = path.posix.join(
          getFolder(module.name, field.name),
          `${id}${getExtension(upload.originalname)}`,
        );

        await moveFile(upload.path, filePath);
        added.push(filePath);

        records.push({
          id,
          name: upload.originalname,
          path: filePath,
          type: upload.mimetype,
          size: upload.size,
          moduleId: module.id,
          fieldName: field.name,
        });
        data[field.name] = id;
      }

      for (const field of fileFields) {
        const value = data[field.name];
        const isUploaded = records.some(record => record.id === value);

        if (!value || isUploaded || value === oldData?.[field.name]) continue;

        throw new Error(`${enums.statusCode.BAD_REQUEST}:${field.label} must be an uploaded file`);
      }

      if (records.length) {
        await fileQuery.save(records, transaction);
      }
    },

    // Deletes the files a row no longer points at. Without `newData` (a deleted row) all go.
    async removeUnused(fields, oldData, newData) {
      if (!oldData) return;

      const ids = getFileFields(fields)
        .filter(
          field =>
            !newData || (field.name in newData && newData[field.name] !== oldData[field.name]),
        )
        .map(field => oldData[field.name])
        .filter(isFileId);

      if (!ids.length) return;

      const deletedFiles = await fileQuery.deleteByIds(ids, transaction);
      removed.push(...deletedFiles.map(file => file.path));
    },

    async removeModule(module) {
      await fileQuery.deleteByModuleId(module.id, transaction);

      // A module whose name is not a valid folder name could not have stored any file.
      if (FOLDER_NAME_PATTERN.test(module.name)) {
        removed.push(getFolder(module.name));
      }
    },

    // Call after the transaction is committed.
    async commit() {
      await removeFromDisk(removed);
    },

    // Call after the transaction is rolled back.
    async rollback() {
      await removeFromDisk(added);
    },
  };
}

async function getFile(id) {
  if (!isFileId(id)) return null;
  return await fileQuery.findById(id);
}

module.exports = {
  createFileChanges,
  getFile,
};
