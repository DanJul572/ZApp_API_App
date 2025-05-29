const jwt = require('jsonwebtoken');

const authQuery = require('../queries/authQuery');
const auth = require('../constats/auth');

async function findValidTokenForUser(userId) {
    try {
        const userToken = await authQuery.findTokenByUserId(userId);
        if (userToken) {
            const decoded = jwt.verify(userToken.token, auth.secretKey);
            const isExpired = decoded.exp < Date.now() / 1000;
            if (!isExpired) {
                return userToken.token;
            } else {
                await authQuery.deleteTokenByUserId(userToken.userId);
                return false;
            }
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

module.exports = findValidTokenForUser;
