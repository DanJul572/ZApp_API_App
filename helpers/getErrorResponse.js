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

module.exports = getErrorResponse;
