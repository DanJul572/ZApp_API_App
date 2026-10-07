const maskSensitiveData = require('../../helpers/maskSensitiveData');

describe('maskSensitiveData', () => {
  it('should mask sensitive keys at any depth', () => {
    const data = {
      email: 'a@mail.com',
      password: 'secret',
      data: { accessToken: 'abc', name: 'A' },
    };

    expect(maskSensitiveData(data)).toEqual({
      email: 'a@mail.com',
      password: '********',
      data: { accessToken: '********', name: 'A' },
    });
  });

  it('should mask the extra field names it is given', () => {
    expect(maskSensitiveData({ pin: '1234', name: 'A' }, ['pin'])).toEqual({
      pin: '********',
      name: 'A',
    });
  });

  it('should keep null values and leave non-objects untouched', () => {
    expect(maskSensitiveData({ password: null })).toEqual({ password: null });
    expect(maskSensitiveData(null)).toBeNull();
    expect(maskSensitiveData('text')).toBe('text');
  });
});
