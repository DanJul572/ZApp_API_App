const Op = require('sequelize').Op;

const Menu = require('../models').Menu;
const Role = require('../models').Role;

module.exports = {
    list(req, res) {
        try {
            const request = req.body;
            const limit = 10;
            const offset = (request.page - 1) * limit;
            const where = {
                [request.search.column]: {
                    [Op.iLike]: `%${request.search.value}%`,
                },
            };
            const order = [[request.sort.column, request.sort.value]];
            const attributes = ['id', 'label', 'createdAt', 'updatedAt'];
            const include = [
                {
                    model: Role,
                    as: 'role',
                    attributes: [['id', 'value'], 'label'],
                },
            ];

            return Menu.findAll({attributes, include, where, limit, offset, order})
                .then(users => res.status(200).send(users))
                .catch(error => {
                    res.status(400).send(error);
                });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
};
