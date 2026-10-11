function getUserById() {
  return 'SELECT * FROM "users" WHERE "id" = ?';
}

// Email addresses that only differ in letter case are treated as the same address.
function getOtherUserByEmail() {
  return 'SELECT "id" FROM "users" WHERE LOWER("email") = LOWER(?) AND "id" <> ? LIMIT 1';
}

function getPicture() {
  return 'SELECT * FROM "userPictures" WHERE "userId" = ?';
}

function getPictureInfo() {
  return (
    'SELECT "id", "fileName", "mimeType", "fileSize", "updatedAt" FROM "userPictures" ' +
    'WHERE "userId" = ?'
  );
}

module.exports = {
  getOtherUserByEmail,
  getPicture,
  getPictureInfo,
  getUserById,
};
