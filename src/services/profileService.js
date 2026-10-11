const enums = require('../enums');
const createAuditTrail = require('../helpers/createAuditTrail');
const commonQuery = require('../queries/commonQuery');
const fieldQuery = require('../queries/fieldQuery');
const moduleQuery = require('../queries/moduleQuery');
const profileQuery = require('../queries/profileQuery');
const authService = require('./authService');

// User Pictures is registered by name, like the email modules, so its id is looked up.
const pictureModuleName = 'userPictures';

// Picture types are read from the file content, not from the name or type the browser sends.
const imageSignatures = [
  { mimeType: 'image/jpeg', matches: buffer => buffer.subarray(0, 3).toString('hex') === 'ffd8ff' },
  {
    mimeType: 'image/png',
    matches: buffer => buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a',
  },
  {
    mimeType: 'image/webp',
    matches: buffer =>
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP',
  },
];

// Errors thrown as "<status>:<message>" are answered with that status by the controllers.
function requestError(status, message) {
  return new Error(`${status}:${message}`);
}

function getImageType(buffer) {
  return imageSignatures.find(signature => signature.matches(buffer))?.mimeType || null;
}

async function getProfile(userId, transaction) {
  const user = await profileQuery.getUserById(userId, transaction);
  if (!user) return null;

  const picture = await profileQuery.getPictureInfo(userId, transaction);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: picture
      ? {
          fileName: picture.fileName,
          mimeType: picture.mimeType,
          fileSize: picture.fileSize,
          updatedAt: picture.updatedAt,
        }
      : null,
  };
}

async function getPicture(userId) {
  return await profileQuery.getPicture(userId);
}

async function getExistingUser(userId, transaction) {
  const user = await profileQuery.getUserById(userId, transaction);
  if (!user) {
    throw requestError(enums.statusCode.NOT_FOUND, 'User not found');
  }
  return user;
}

async function createUserAuditTrail(req, oldUser, transaction) {
  const module = await moduleQuery.getModule(enums.moduleId.users);
  const fields = await fieldQuery.getFields(module.id);
  const newUser = await profileQuery.getUserById(oldUser.id, transaction);

  await createAuditTrail(
    req,
    {
      module,
      fields,
      action: enums.auditAction.update,
      rowId: oldUser.id,
      oldData: oldUser,
      newData: newUser,
    },
    transaction,
  );

  return newUser;
}

async function createPictureAuditTrail(req, audit, transaction) {
  const module = await moduleQuery.getModuleByName(pictureModuleName, transaction);
  if (!module) {
    throw new Error(`Module "${pictureModuleName}" is not registered`);
  }

  const fields = await fieldQuery.getFields(module.id);

  await createAuditTrail(req, { module, fields, ...audit }, transaction);
}

/**
 * Stores a new picture (or replaces the current one), or removes the current picture when
 * `removePicture` is set and no new file is sent.
 */
async function savePicture(req, userId, file, removePicture, transaction) {
  const oldPicture = await profileQuery.getPicture(userId, transaction);

  if (file) {
    const mimeType = getImageType(file.buffer);
    if (!mimeType) {
      throw requestError(
        enums.statusCode.UNSUPPORTED_MEDIA_TYPE,
        'Profile picture must be a JPG, PNG or WEBP image',
      );
    }

    const data = {
      fileName: file.originalname,
      mimeType,
      fileSize: file.size,
      fileBuffer: file.buffer,
    };

    if (oldPicture) {
      await commonQuery.updateRow('userPictures', 'id', oldPicture.id, data, transaction);
      await createPictureAuditTrail(
        req,
        {
          action: enums.auditAction.update,
          rowId: oldPicture.id,
          oldData: oldPicture,
          newData: await profileQuery.getPicture(userId, transaction),
        },
        transaction,
      );
    } else {
      const picture = await commonQuery.insertRow('userPictures', { ...data, userId }, transaction);
      await createPictureAuditTrail(
        req,
        { action: enums.auditAction.create, rowId: picture.id, newData: picture },
        transaction,
      );
    }
    return;
  }

  if (removePicture && oldPicture) {
    await commonQuery.deleteRow('userPictures', 'id', oldPicture.id, transaction);
    await createPictureAuditTrail(
      req,
      { action: enums.auditAction.delete, rowId: oldPicture.id, oldData: oldPicture },
      transaction,
    );
  }
}

/**
 * Saves the name, email and picture of a user and records each change in the audit trail.
 * Returns the updated user row.
 */
async function updateProfile(req, userId, request, file, transaction) {
  const user = await getExistingUser(userId, transaction);

  const emailOwner = await profileQuery.getOtherUserByEmail(request.email, userId, transaction);
  if (emailOwner) {
    throw requestError(enums.statusCode.CONFLICT, 'Email is already used by another user');
  }

  await commonQuery.updateRow(
    'users',
    'id',
    userId,
    { name: request.name, email: request.email },
    transaction,
  );
  const updatedUser = await createUserAuditTrail(req, user, transaction);

  await savePicture(req, userId, file, request.removePicture, transaction);

  return updatedUser;
}

async function changePassword(req, userId, request, transaction) {
  const user = await getExistingUser(userId, transaction);

  const passwordIsMatch = await authService.checkPassword(request.currentPassword, user.password);
  if (!passwordIsMatch) {
    throw requestError(enums.statusCode.BAD_REQUEST, 'Current password is incorrect');
  }

  const password = await authService.hashPassword(request.newPassword);
  await commonQuery.updateRow('users', 'id', userId, { password }, transaction);
  await createUserAuditTrail(req, user, transaction);
}

module.exports = {
  changePassword,
  getImageType,
  getPicture,
  getProfile,
  updateProfile,
};
