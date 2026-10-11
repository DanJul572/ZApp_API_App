const jwt = require('jsonwebtoken');

const authService = require('../../services/authService');

jest.mock('../../models', () => ({}));
jest.mock('../../config/jwt', () => ({ secretKey: 'test-secret', salt: 4, expiredIn: '1h' }));

describe('authService', () => {
  describe('renewToken', () => {
    it('should carry the new name and email and keep the old expiry', () => {
      const exp = Math.floor(Date.now() / 1000) + 600;
      const currentToken = { userId: 1, userName: 'Old', afterLogin: '/home', exp };

      const token = authService.renewToken(currentToken, {
        id: 1,
        name: 'New',
        email: 'new@mail.com',
        roleId: 2,
      });

      expect(jwt.verify(token, 'test-secret')).toMatchObject({
        userId: 1,
        userName: 'New',
        email: 'new@mail.com',
        roleId: 2,
        afterLogin: '/home',
        exp,
      });
    });
  });

  describe('getCookieSetting', () => {
    it('should keep the cookie until the token expires', () => {
      const exp = Math.floor(Date.now() / 1000) + 600;

      const { maxAge } = authService.getCookieSetting(exp);

      expect(maxAge).toBeGreaterThan(590 * 1000);
      expect(maxAge).toBeLessThanOrEqual(600 * 1000);
    });

    it('should default to one hour', () => {
      expect(authService.getCookieSetting().maxAge).toBe(60 * 60 * 1000);
    });
  });
});
