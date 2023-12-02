const query = require('../helpers/query');
const db = require('../models');

const Module = db.Module;
const Field = db.Field;

module.exports = {
    async list(req, res) {
        try {
            const request = req.body;
            const limit = 10;
            const offset = (request.page - 1) * limit;
            const where = {
                [request.search.column]: {
                    [db.Sequelize.Op.iLike]: `%${request.search.value}%`,
                },
            };
            const order = [[request.sort.column, request.sort.value]];
            const attributes = ['id', 'name', 'label', 'description', 'createdAt', 'updatedAt'];

            const modules = await Module.findAll({attributes, where, limit, offset, order});

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
            await query.createTable(request.name, request.fields);

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
            /* delete table */
            await query.dropTable(request.name, request.sequence, request.id);

            /* commit */
            await t.commit();

            return res.status(200).send('Module has been deleted');
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },
};
