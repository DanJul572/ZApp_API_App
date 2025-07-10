module.exports = {
  save(files, moduleId) {
    let query =
      'INSERT INTO "Files" ("name", "data", "type", "encoding", "size", "moduleId") VALUES ';
    const values = [];

    files.forEach((file, index) => {
      const fileBuffer = Buffer.from(file.buffer, 'base64');

      query += `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5}, $${
        index * 6 + 6
      })${index + 1 < files.length ? ', ' : ''}`;

      values.push(file.originalname, fileBuffer, file.mimetype, file.encoding, file.size, moduleId);
    });

    return {query, values};
  },

  delete(files) {
    let query = 'DELETE FROM "Files" WHERE "name" IN (';
    for (let index = 0; index < files.length; index++) {
      query += `$${index + 1}`;
      if (index + 1 < files.length) {
        query += ', ';
      }
    }
    query += ')';
    return query;
  },

  deleteByModuleId() {
    return 'DELETE FROM "Files" WHERE "moduleId" = $1';
  },

  download() {
    return 'SELECT "id", "name", "data", "type", "encoding", "size" from "Files" WHERE "name" = $1';
  },
};
