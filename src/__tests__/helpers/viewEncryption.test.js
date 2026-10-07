const viewEncryption = require('../../helpers/viewEncryption');

describe('viewEncryption', () => {
  const passphrase = 'test-passphrase';
  const data = [{ id: 'a', properties: { label: '"Tést ✓"' } }];

  it('should decrypt content encrypted by CryptoJS in the web app', () => {
    // CryptoJS.AES.encrypt(JSON.stringify(data), passphrase).toString()
    const fromWebApp =
      'U2FsdGVkX18D7cAZw9wBM4GyOuqJlQ1QjrFiHMsHsIhd6EEBwP/kOOVrym7PTrbSQ+dg4IqNKUN4T3yJ4Jr/+4GjCIARcothkRVahLqyX4Q=';

    expect(viewEncryption.decrypt(fromWebApp, passphrase)).toEqual(data);
  });

  it('should produce the CryptoJS "Salted__" format with a random salt', () => {
    const first = viewEncryption.encrypt(data, passphrase);
    const second = viewEncryption.encrypt(data, passphrase);

    expect(Buffer.from(first, 'base64').subarray(0, 8).toString()).toBe('Salted__');
    expect(first).not.toBe(second);
    expect(viewEncryption.decrypt(first, passphrase)).toEqual(data);
  });

  it('should refuse to run without a passphrase', () => {
    expect(() => viewEncryption.encrypt(data, undefined)).toThrow('VIEW_ENCRYPTION_KEY');
  });
});
