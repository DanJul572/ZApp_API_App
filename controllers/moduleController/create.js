const db = require('@db');
const enums = require('@enums');

const moduleService = require('@services/moduleService');

async function create(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = JSON.parse(req.body.data);
    const createdModule = await moduleService.insertModule({...request}, t);

    const fields = request.fields.map(field => {
      field.moduleId = createdModule.id;
      return field;
    });
    await moduleService.insertFields(fields);

    await moduleService.generateTable(request.name, request.fields);

    await t.commit();
    return res.status(enums.statusCode.OK).send('Module has been created');
  } catch (error) {
    await t.rollback();
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = create;
