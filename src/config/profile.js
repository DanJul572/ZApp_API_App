module.exports = {
  picture: {
    // In megabytes.
    maxSize: 2,
  },
  password: {
    minLength: 8,
    // bcrypt only reads the first 72 bytes of a password.
    maxLength: 72,
  },
};
