function replacePlaceholders(user, str, obj) {
    const placeholderRegex = /@(\w+)@/g;
    const combinedObj = {...user, ...obj};

    return str.replace(placeholderRegex, (match, placeholder) => {
        return combinedObj[placeholder] !== undefined ? combinedObj[placeholder] : match;
    });
}

module.exports = {
    replacePlaceholders,
};
