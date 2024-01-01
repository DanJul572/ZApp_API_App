const db = require('../models');
const orm = require('../queries/orm');
const moduleQuery = require('../queries/moduleQuery');
const fieldQuery = require('../queries/fieldQuery');
const {rowsPerPage} = require('../constats/setting');

const Module = db.Module;
const Field = db.Field;

module.exports = {
    async list(req, res) {
        try {
            const request = req.body;
            const limit = rowsPerPage;
            const offset = (request.page - 1) * limit;
            const where = orm.filter(request.filter);
            const order = orm.sort(request.sort);
            const attributes = ['id', 'name', 'label', 'description', 'createdAt', 'updatedAt'];

            const modules = await Module.findAndCountAll({attributes, where, limit, offset, order});

            return res.status(200).send(modules);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    async create(req, res) {
        const t = await db.sequelize.transaction();
        const request = req.body;

        try {
            /* validation */
            if (!request.fields) throw new Error('Field cannot be empty');

            /* insert module and field */
            await Module.create(request, {
                transaction: t,
                include: {
                    model: Field,
                    as: 'fields',
                },
            });

            /* create table */
            await moduleQuery.createTable(request.name, request.fields);

            /* commit */
            await t.commit();

            return res.status(200).send('Module has been created');
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },
    async delete(req, res) {
        const t = await db.sequelize.transaction();
        const request = req.body;

        try {
            /* module info */
            const module = await moduleQuery.getModule(request.id);

            /* module feld */
            const fields = await fieldQuery.getFields(module.id);

            /* get identity field */
            const identity = fields.find(field => field.identity);

            /* delete module */
            await Module.destroy({
                transaction: t,
                where: {
                    id: module.id,
                },
            });

            /* delete feld */
            await fieldQuery.deleteFields(module.id);

            /* delete table */
            await moduleQuery.dropTable(module.name, identity.name);

            /* commit */
            await t.commit();

            return res.status(200).send('Module has been deleted');
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },
};
