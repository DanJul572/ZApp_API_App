const { binaryFile, id, number, reference, shortText } = require('./fieldDefinitions');

// Definitions of the user tables added after the core modules. Like the email modules, they are
// looked up by name instead of having a fixed id in enums.moduleId.
module.exports = [
  {
    name: 'userPictures',
    label: 'User Pictures',
    fields: [
      id(),
      reference('userId', 'User', 'users', 'name', { notNull: true, unique: true }),
      shortText('fileName', 'File Name', { notNull: true }),
      shortText('mimeType', 'MIME Type', { notNull: true }),
      number('fileSize', 'File Size', { notNull: true }),
      binaryFile('fileBuffer', 'Picture', { notNull: true }),
    ],
  },
];
