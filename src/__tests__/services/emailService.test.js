const emailService = require('../../services/emailService');
const createAuditTrail = require('../../helpers/createAuditTrail');
const commonQuery = require('../../queries/commonQuery');
const emailQuery = require('../../queries/emailQuery');
const fieldQuery = require('../../queries/fieldQuery');
const moduleQuery = require('../../queries/moduleQuery');
const enums = require('../../enums');

jest.mock('../../models', () => ({}));
jest.mock('../../helpers/createAuditTrail');
jest.mock('../../queries/commonQuery');
jest.mock('../../queries/emailQuery');
jest.mock('../../queries/fieldQuery');
jest.mock('../../queries/moduleQuery');

describe('emailService audit', () => {
  const transaction = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should snapshot the whole template without the ids of rebuilt child rows', async () => {
    commonQuery.getRowDetail.mockResolvedValue({ id: 3, name: 'Welcome', useScheduler: false });
    emailQuery.getByEmailId.mockImplementation(async table => {
      if (table === 'emailCC') return [{ id: 10, label: 'cc@mail.com' }];
      if (table === 'emailDataSources') {
        return [
          {
            id: 20,
            name: 'extra',
            query: 'SELECT 1',
            emailDataSourceTypeId: enums.emailDataSourceType.optional,
          },
        ];
      }
      if (table === 'emailTags') {
        return [{ id: 30, label: 'name', value: 'fullName', defaultValue: null }];
      }
      return [];
    });
    emailQuery.getAttachments.mockResolvedValue([{ id: 40, fileName: 'a.pdf' }]);

    const data = await emailService.getEmailAuditData(3, transaction);

    expect(commonQuery.getRowDetail).toHaveBeenCalledWith('emails', 3, 'id', transaction);
    expect(emailQuery.getByEmailId).toHaveBeenCalledWith('emailTags', 3, transaction);
    expect(emailQuery.getAttachments).toHaveBeenCalledWith(3, transaction);
    expect(data).toMatchObject({
      id: 3,
      name: 'Welcome',
      cc: ['cc@mail.com'],
      optionalSources: [{ name: 'extra', sql: 'SELECT 1' }],
      mergeTags: [{ tag: 'name', column: 'fullName', defaultValue: '' }],
      attachments: [{ id: 40, fileName: 'a.pdf' }],
    });
    expect(data.optionalSources[0]).not.toHaveProperty('id');
    expect(data.mergeTags[0]).not.toHaveProperty('id');
  });

  it('should return null when the template does not exist', async () => {
    commonQuery.getRowDetail.mockResolvedValue(null);

    await expect(emailService.getEmailAuditData(3, transaction)).resolves.toBeNull();
  });

  it('should file the audit row under the emails module', async () => {
    const module = { id: 25, name: 'emails' };
    const fields = [{ name: 'id', identity: true }];
    const req = {};
    moduleQuery.getModuleByName.mockResolvedValue(module);
    fieldQuery.getFields.mockResolvedValue(fields);

    await emailService.createEmailAuditTrail(
      req,
      { action: enums.auditAction.delete, rowId: 3, oldData: { id: 3 } },
      transaction,
    );

    expect(moduleQuery.getModuleByName).toHaveBeenCalledWith('emails', transaction);
    expect(fieldQuery.getFields).toHaveBeenCalledWith(25);
    expect(createAuditTrail).toHaveBeenCalledWith(
      req,
      { module, fields, action: enums.auditAction.delete, rowId: 3, oldData: { id: 3 } },
      transaction,
    );
  });

  it('should fail when the emails module is not registered', async () => {
    moduleQuery.getModuleByName.mockResolvedValue(null);

    await expect(
      emailService.createEmailAuditTrail({}, { action: enums.auditAction.create }, transaction),
    ).rejects.toThrow('Module "emails" is not registered');
    expect(createAuditTrail).not.toHaveBeenCalled();
  });
});
