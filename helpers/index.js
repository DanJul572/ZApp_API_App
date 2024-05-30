function replacePlaceholders(str, obj, user = {}) {
    const combinedObj = {...user, ...obj};
    return str.replace(/@(\w+)@/g, (match, placeholder) =>
        combinedObj[placeholder] !== undefined ? combinedObj[placeholder] : match,
    );
}

function getErrorResponse(error) {
    const separatorIndex = error.indexOf(':');
    if (separatorIndex === -1) {
        return {
            message: error,
            code: 500,
        };
    }

    const code = error.substring(0, separatorIndex);
    const message = error.substring(separatorIndex + 1);

    return {
        message,
        code: parseInt(code),
    };
}

module.exports = {
    replacePlaceholders,
    getErrorResponse,
};
