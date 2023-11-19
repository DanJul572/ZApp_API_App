const query = require('../helpers/query');
const db = require('../models');

const Module = db.Module;
const Field = db.Field;

module.exports = {
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
