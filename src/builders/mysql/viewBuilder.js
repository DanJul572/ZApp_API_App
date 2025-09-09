function getOptions() {
  return 'SELECT `id` AS `value`, `label` AS `label` FROM `Views` WHERE `moduleId` = $1';
}

module.exports = {
  getOptions,
};
