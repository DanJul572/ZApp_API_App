module.exports = {
  save(files, moduleId) {
    let query =
      'INSERT INTO `Files` (`name`, `data`, `type`, `encoding`, `size`, `moduleId`) VALUES ';
    const values = [];

    files.forEach((file, index) => {
      const fileBuffer = Buffer.from(file.buffer, 'base64');

      query += `(?, ?, ?, ?, ?, ?)${index + 1 < files.length ? ', ' : ''}`;

      values.push(file.originalname, fileBuffer, file.mimetype, file.encoding, file.size, moduleId);
    });

    return {query, values};
  },

  delete(files) {
    let query = 'DELETE FROM `Files` WHERE `name` IN (';
    for (let index = 0; index < files.length; index++) {
      query += '?';
      if (index + 1 < files.length) {
        query += ', ';
      }
    }
    query += ')';
    return {query, values: files};
  },

  deleteByModuleId() {
    return {
      query: 'DELETE FROM `Files` WHERE `moduleId` = ?',
    };
  },

  download() {
    return {
      query:
        'SELECT `id`, `name`, `data`, `type`, `encoding`, `size` FROM `Files` WHERE `name` = ?',
    };
  },
};
