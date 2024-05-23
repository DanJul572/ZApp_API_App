function replacePlaceholders(str, obj, user = null) {
    const placeholderRegex = /@(\w+)@/g;
    let combinedObj = null;

    if (!user) {
        combinedObj = {...obj};
    } else {
        combinedObj = {...user, ...obj};
    }

    return str.replace(placeholderRegex, (match, placeholder) => {
        return combinedObj[placeholder] !== undefined ? combinedObj[placeholder] : match;
    });
}

module.exports = {
    replacePlaceholders,
};
