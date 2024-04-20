function replacePlaceholders(str, obj) {
    const placeholderRegex = /@(\w+)@/g;

    return str.replace(placeholderRegex, (match, placeholder) => {
        return obj[placeholder] !== undefined ? obj[placeholder] : match;
    });
}

module.exports = {
    replacePlaceholders,
};
