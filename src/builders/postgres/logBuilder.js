function deleteExpired(table) {
  return `DELETE FROM "${table}" WHERE "createdAt" < NOW() - (? * INTERVAL '1 day')`;
}

module.exports = {
  deleteExpired,
};
