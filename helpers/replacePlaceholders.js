function replacePlaceholders(str, obj, user = {}) {
    const combinedObj = {...user, ...obj};
    return str.replace(/@(\w+)@/g, (match, placeholder) =>
        combinedObj[placeholder] !== undefined ? combinedObj[placeholder] : match,
    );
}

module.exports = replacePlaceholders;
