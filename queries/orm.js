module.exports = {
  filter(arr) {
    if (!arr || arr.length <= 0) return {};

    const obj = {};
    for (let x = 0; x < arr.length; x++) {
      const filter = arr[x];
      obj[filter.id] = filter.value;
    }
    return obj;
  },
  sort(arr) {
    if (!arr || arr.length <= 0) return [];

    const result = [];
    for (let x = 0; x < arr.length; x++) {
      const sort = arr[x];
      result.push([sort.id, sort.desc ? 'DESC' : 'ASC']);
    }
    return result;
  },
};
