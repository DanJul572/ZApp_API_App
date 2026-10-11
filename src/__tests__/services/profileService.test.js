const profileService = require('../../services/profileService');
const authService = require('../../services/authService');
const createAuditTrail = require('../../helpers/createAuditTrail');
const commonQuery = require('../../queries/commonQuery');
const fieldQuery = require('../../queries/fieldQuery');
const moduleQuery = require('../../queries/moduleQuery');
const profileQuery = require('../../queries/profileQuery');
const enums = require('../../enums');

jest.mock('../../models', () => ({}));
jest.mock('../../helpers/createAuditTrail');
jest.mock('../../queries/commonQuery');
jest.mock('../../queries/fieldQuery');
jest.mock('../../queries/moduleQuery');
jest.mock('../../queries/profileQuery');
jest.mock('../../services/authService');

const png = Buffer.from('89504e470d0a1a0a0000', 'hex');
const jpeg = Buffer.from('ffd8ffe000104a464946', 'hex');
const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBPVP8 ')]);

describe('profileService', () => {
  const req = {};
  const transaction = {};
  const usersModule = { id: enums.moduleId.users, name: 'users' };
  const pictureModule = { id: 30, name: 'userPictures' };
  const oldUser = { id: 1, name: 'Old', email: 'old@mail.com', password: 'hash' };
  const newUser = { id: 1, name: 'New', email: 'new@mail.com', password: 'hash' };

  beforeEach(() => {
    profileQuery.getUserById.mockResolvedValueOnce(oldUser).mockResolvedValue(newUser);
    profileQuery.getOtherUserByEmail.mockResolvedValue(null);
    profileQuery.getPicture.mockResolvedValue(null);
    moduleQuery.getModule.mockResolvedValue(usersModule);
    moduleQuery.getModuleByName.mockResolvedValue(pictureModule);
    fieldQuery.getFields.mockImplementation(async moduleId => [{ name: 'id', moduleId }]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const auditActions = () =>
    createAuditTrail.mock.calls.map(([, audit]) => [audit.module.name, audit.action]);

  describe('getImageType', () => {
    it('should read the image type from the file content', () => {
      expect(profileService.getImageType(png)).toBe('image/png');
      expect(profileService.getImageType(jpeg)).toBe('image/jpeg');
      expect(profileService.getImageType(webp)).toBe('image/webp');
      expect(profileService.getImageType(Buffer.from('<svg></svg>'))).toBeNull();
    });
  });

  describe('updateProfile', () => {
    const request = { name: 'New', email: 'new@mail.com', removePicture: false };

    it('should save the name and email and audit the user row', async () => {
      const result = await profileService.updateProfile(req, 1, request, undefined, transaction);

      expect(commonQuery.updateRow).toHaveBeenCalledWith(
        'users',
        'id',
        1,
        { name: 'New', email: 'new@mail.com' },
        transaction,
      );
      expect(createAuditTrail).toHaveBeenCalledWith(
        req,
        expect.objectContaining({
          module: usersModule,
          action: enums.auditAction.update,
          rowId: 1,
          oldData: oldUser,
          newData: newUser,
        }),
        transaction,
      );
      expect(auditActions()).toEqual([['users', enums.auditAction.update]]);
      expect(result).toBe(newUser);
    });

    it('should refuse an email that another user already has', async () => {
      profileQuery.getOtherUserByEmail.mockResolvedValue({ id: 2 });

      await expect(
        profileService.updateProfile(req, 1, request, undefined, transaction),
      ).rejects.toThrow('409:Email is already used by another user');
      expect(commonQuery.updateRow).not.toHaveBeenCalled();
    });

    it('should add a first picture and audit it as created', async () => {
      const file = { originalname: 'me.png', size: png.length, buffer: png };
      commonQuery.insertRow.mockResolvedValue({ id: 5, userId: 1, fileBuffer: png });

      await profileService.updateProfile(req, 1, request, file, transaction);

      expect(commonQuery.insertRow).toHaveBeenCalledWith(
        'userPictures',
        {
          fileName: 'me.png',
          mimeType: 'image/png',
          fileSize: png.length,
          fileBuffer: png,
          userId: 1,
        },
        transaction,
      );
      expect(auditActions()).toContainEqual(['userPictures', enums.auditAction.create]);
    });

    it('should replace the current picture and audit the old and new rows', async () => {
      const oldPicture = { id: 5, userId: 1, mimeType: 'image/png', fileBuffer: png };
      const newPicture = { id: 5, userId: 1, mimeType: 'image/jpeg', fileBuffer: jpeg };
      profileQuery.getPicture.mockResolvedValueOnce(oldPicture).mockResolvedValueOnce(newPicture);
      const file = { originalname: 'me.jpg', size: jpeg.length, buffer: jpeg };

      await profileService.updateProfile(req, 1, request, file, transaction);

      expect(commonQuery.updateRow).toHaveBeenCalledWith(
        'userPictures',
        'id',
        5,
        expect.objectContaining({ mimeType: 'image/jpeg', fileBuffer: jpeg }),
        transaction,
      );
      expect(createAuditTrail).toHaveBeenCalledWith(
        req,
        expect.objectContaining({
          module: pictureModule,
          action: enums.auditAction.update,
          rowId: 5,
          oldData: oldPicture,
          newData: newPicture,
        }),
        transaction,
      );
    });

    it('should refuse a file that is not a JPG, PNG or WEBP image', async () => {
      const file = { originalname: 'me.png', size: 11, buffer: Buffer.from('<svg></svg>') };

      await expect(
        profileService.updateProfile(req, 1, request, file, transaction),
      ).rejects.toThrow('415:Profile picture must be a JPG, PNG or WEBP image');
      expect(commonQuery.insertRow).not.toHaveBeenCalled();
    });

    it('should remove the current picture when asked', async () => {
      const oldPicture = { id: 5, userId: 1, fileBuffer: png };
      profileQuery.getPicture.mockResolvedValue(oldPicture);

      await profileService.updateProfile(
        req,
        1,
        { ...request, removePicture: true },
        undefined,
        transaction,
      );

      expect(commonQuery.deleteRow).toHaveBeenCalledWith('userPictures', 'id', 5, transaction);
      expect(createAuditTrail).toHaveBeenCalledWith(
        req,
        expect.objectContaining({
          module: pictureModule,
          action: enums.auditAction.delete,
          oldData: oldPicture,
        }),
        transaction,
      );
    });
  });

  describe('changePassword', () => {
    const request = { currentPassword: 'old-pass', newPassword: 'new-pass-1' };

    it('should refuse a wrong current password', async () => {
      authService.checkPassword.mockResolvedValue(false);

      await expect(profileService.changePassword(req, 1, request, transaction)).rejects.toThrow(
        '400:Current password is incorrect',
      );
      expect(authService.checkPassword).toHaveBeenCalledWith('old-pass', 'hash');
      expect(commonQuery.updateRow).not.toHaveBeenCalled();
      expect(createAuditTrail).not.toHaveBeenCalled();
    });

    it('should save the new password hashed and audit the user row', async () => {
      authService.checkPassword.mockResolvedValue(true);
      authService.hashPassword.mockResolvedValue('new-hash');

      await profileService.changePassword(req, 1, request, transaction);

      expect(authService.hashPassword).toHaveBeenCalledWith('new-pass-1');
      expect(commonQuery.updateRow).toHaveBeenCalledWith(
        'users',
        'id',
        1,
        { password: 'new-hash' },
        transaction,
      );
      expect(auditActions()).toEqual([['users', enums.auditAction.update]]);
    });
  });
});
