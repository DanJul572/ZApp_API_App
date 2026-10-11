const profileValidation = require('../../validations/profileValidation');

describe('profileValidation', () => {
  describe('changePassword', () => {
    const validate = body => profileValidation.changePassword.body.validate(body).error?.message;

    it('should accept a valid request', () => {
      expect(
        validate({
          currentPassword: 'old-pass',
          newPassword: 'new-pass-1',
          confirmPassword: 'new-pass-1',
        }),
      ).toBeUndefined();
    });

    it('should refuse a short new password', () => {
      expect(
        validate({ currentPassword: 'old-pass', newPassword: 'short', confirmPassword: 'short' }),
      ).toBe('New password must be at least 8 characters');
    });

    it('should refuse a new password equal to the current one', () => {
      expect(
        validate({
          currentPassword: 'same-pass',
          newPassword: 'same-pass',
          confirmPassword: 'same-pass',
        }),
      ).toBe('New password must be different from the current password');
    });

    it('should refuse a confirmation that does not match', () => {
      expect(
        validate({
          currentPassword: 'old-pass',
          newPassword: 'new-pass-1',
          confirmPassword: 'new-pass-2',
        }),
      ).toBe('Password confirmation does not match the new password');
    });
  });

  describe('update', () => {
    it('should trim the values and default removePicture to false', () => {
      const { value, error } = profileValidation.update.body.validate({
        name: '  Dev  ',
        email: ' dev@zapp.com ',
      });

      expect(error).toBeUndefined();
      expect(value).toEqual({ name: 'Dev', email: 'dev@zapp.com', removePicture: false });
    });

    it('should refuse an invalid email', () => {
      const { error } = profileValidation.update.body.validate({ name: 'Dev', email: 'dev' });

      expect(error.message).toBe('Email format is invalid');
    });
  });
});
