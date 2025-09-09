module.exports = {
  getValidations() {
    return `SELECT \`Scripts\`.\`sql\` FROM \`Validations\`
      JOIN \`Scripts\`
      ON \`Validations\`.\`scriptId\` = \`Scripts\`.\`id\`
      WHERE \`Validations\`.\`moduleId\` = ?
      AND \`Validations\`.\`actionId\` = ?
      AND \`Validations\`.\`validationTimeId\` = ?
      ORDER BY \`Validations\`.\`id\` ASC;
    `;
  },
};
