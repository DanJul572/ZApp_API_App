const db = require('../models');

const View = db.View;

module.exports = {
    async create(req, res) {
        const t = await db.sequelize.transaction();
        const request = req.body;

        try {
            await View.create(request);
            await t.commit();

            return res.status(200).send('View has been saved');
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },
};
