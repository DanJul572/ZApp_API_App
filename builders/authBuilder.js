module.exports = {
    findByEmail() {
        return `SELECT * FROM "Users" WHERE "email" = $1;`;
    },

    findTokenByUserId() {
        return `SELECT * FROM "Tokens" WHERE "userId" = $1;`;
    },

    deleteTokenByUserId() {
        return `DELETE FROM "Tokens" WHERE "userId" = $1;`;
    },
};
