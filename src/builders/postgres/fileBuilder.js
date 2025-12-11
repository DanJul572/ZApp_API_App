function save(files, moduleId) {
  let query =
    'INSERT INTO "files" ("name", "data", "type", "encoding", "size", "moduleId") VALUES ';
  const values = [];

  files.forEach((file, index) => {
    const fileBuffer = Buffer.from(file.buffer, 'base64');
    query += `(?, ?, ?, ?, ?, ?)${index + 1 < files.length ? ', ' : ''}`;
    values.push(file.originalname, fileBuffer, file.mimetype, file.encoding, file.size, moduleId);
  });

  return {query, values};
}

function deleteFile(files) {
  let placeholders = files.map(() => '?').join(', ');
  let query = `DELETE FROM "files" WHERE "name" IN (${placeholders})`;
  return {query, values: files};
}

function deleteByModuleId() {
  return 'DELETE FROM "files" WHERE "moduleId" = ?';
}

function download() {
  return 'SELECT "id", "name", "data", "type", "encoding", "size" FROM "files" WHERE "name" = ?';
}

module.exports = {
  save,
  deleteFile,
  deleteByModuleId,
  download,
};
