function save(files) {
  const placeholders = files.map(() => '(?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
  const query =
    'INSERT INTO "files" ("id", "name", "path", "type", "size", "moduleId", "fieldName", ' +
    `"createdAt", "updatedAt") VALUES ${placeholders}`;
  const values = files.flatMap(file => [
    file.id,
    file.name,
    file.path,
    file.type,
    file.size,
    file.moduleId,
    file.fieldName,
  ]);

  return { query, values };
}

function deleteByIds(ids) {
  const placeholders = ids.map(() => '?').join(', ');
  return `DELETE FROM "files" WHERE "id" IN (${placeholders}) RETURNING "path"`;
}

function deleteByModuleId() {
  return 'DELETE FROM "files" WHERE "moduleId" = ?';
}

function findById() {
  return 'SELECT "id", "name", "path", "type", "size" FROM "files" WHERE "id" = ?';
}

module.exports = {
  save,
  deleteByIds,
  deleteByModuleId,
  findById,
};
