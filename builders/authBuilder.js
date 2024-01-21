module.exports = {
    findByEmail(email) {
        return `SELECT * FROM "Users" WHERE "email" = '${email}';`;
    },

    findTokenByUserId(userId) {
        return `SELECT * FROM "Tokens" WHERE "userId" = ${userId};`;
    },

    deleteTokenByUserId(userId) {
        return `DELETE FROM "Tokens" WHERE "userId" = ${userId};`;
    },
};
