const db = require('../../models');
const commonService = require('../../services/commonService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function create(req, res, next) {
  const t = await db.sequelize.transaction();

  try {
    const request = req.body;
    const files = req.files;
    const token = req.cookies.access_token;

    const user = helpers.decodeToken(token);
    const module = await commonService.getModuleById(request.moduleId);
    commonService.assertWritableModule(module);

    const fields = await commonService.getModuleFields(module.id);
    const primaryField = fields.find(field => field.identity);

    await commonService.runValidationBefore(
      request.data,
      module.id,
      enums.actionId.create,
      user,
      t,
    );

    await commonService.insertFile(files, module.id, t);
    const createdData = await commonService.insertData(module.name, request.data, t);

    await helpers.createAuditTrail(
      req,
      {
        module,
        fields,
        action: enums.auditAction.create,
        rowId: createdData[primaryField.name],
        newData: createdData,
      },
      t,
    );

    await commonService.runValidationAfter(request.data, module.id, enums.actionId.create, user, t);

    await t.commit();
    return res.status(enums.statusCode.CREATED).json({
      success: true,
      message: 'Data was created successfully',
    });
  } catch (err) {
    await t.rollback();

    const error = helpers.getErrorResponse(err.message);

    if (error.code === enums.statusCode.INTERNAL_SERVER_ERROR) {
      next(err);
    } else {
      return res.status(error.code).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = create;
