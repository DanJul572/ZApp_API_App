function replacePlaceholders(str, obj, user = null) {
  const userFormat = {};
  if (user) {
    userFormat.currentUserId = user.userId;
    userFormat.currentRoleId = user.roleId;
    userFormat.currentEmail = user.email;
  }
  const combinedObj = {...userFormat, ...obj};
  return str.replace(/@(\w+)@/g, (match, placeholder) =>
    combinedObj[placeholder] !== undefined ? combinedObj[placeholder] : match,
  );
}

module.exports = replacePlaceholders;
