const jwt = require('jsonwebtoken');

const db = require('../models');
const helper = require('../helpers');
const commonService = require('../services/commonService');

const actionId = require('../constats/actionId');
const auth = require('../constats/auth');
const statusCode = require('../constats/statusCode');

async function rows(req, res) {
    try {
        const request = JSON.parse(req.body.data);

        const module = await commonService.getModuleById(request.id);
        const fields = await commonService.getModuleFields(module.id);
        const data = await commonService.getData(
            module.name,
            fields,
            request.page,
            request.advanceFilter,
            request.filter,
            request.sort,
            request.defaultFilter,
        );
        return res.status(statusCode.OK).send(data);
    } catch (error) {
        const response = helper.getErrorResponse(error.message);
        await helper.insertError(req, response.code, error.message);
        return res.status(response.code).send(response.message);
    }
}

async function columns(req, res) {
    try {
        const request = req.query;

        const fields = await commonService.getModuleFields(request.id);
        const data = await commonService.getColumns(fields);

        return res.status(statusCode.OK).send(data);
    } catch (error) {
        const response = helper.getErrorResponse(error.message);
        await helper.insertError(req, response.code, error.message);
        return res.status(response.code).send(response.message);
    }
}

async function detail(req, res) {
    try {
        const request = req.query;
        const token = req.header('Authorization');
        const user = jwt.verify(token, auth.secretKey);

        const module = await commonService.getModuleById(request.moduleId);
        const primaryField = await commonService.getPrimaryField(
            request.moduleId,
        );

        await commonService.runValidationBefore(
            request,
            module.id,
            actionId.detail,
            user,
        );

        const data = await commonService.getDetailData(
            module.name,
            request.rowId,
            primaryField.name,
        );
        return res.status(statusCode.OK).send(data);
    } catch (error) {
        const response = helper.getErrorResponse(error.message);
        await helper.insertError(req, response.code, error.message);
        return res.status(response.code).send(response.message);
    }
}

async function destory(req, res) {
    const t = await db.sequelize.transaction();

    try {
        const request = JSON.parse(req.body.data);

        const module = await commonService.getModuleById(request.moduleId);
        const fields = await commonService.getModuleFields(request.moduleId);
        const primaryField = fields.find(field => field.identity);
        const detailData = await commonService.getDetailData(
            module.name,
            request.id,
            primaryField.name,
        );

        await commonService.deleteFile(fields, detailData);

        const data = await commonService.deleteData(
            module.name,
            primaryField.name,
            request.id,
        );

        t.commit();
        return res.status(statusCode.OK).send(data);
    } catch (error) {
        await t.rollback();
        const response = helper.getErrorResponse(error.message);
        await helper.insertError(req, response.code, error.message);
        return res.status(response.code).send(response.message);
    }
}

async function options(req, res) {
    try {
        const request = req.query;

        const field = await commonService.getField(request.id);
        const data = await commonService.getFieldOptions(field);

        return res.status(statusCode.OK).send(data);
    } catch (error) {
        const response = helper.getErrorResponse(error.message);
        await helper.insertError(req, response.code, error.message);
        return res.status(response.code).send(response.message);
    }
}

async function create(req, res) {
    const t = await db.sequelize.transaction();

    try {
        const request = JSON.parse(req.body.data);
        const files = req.files;
        const token = req.header('Authorization');

        const user = helper.decodeToken(token);
        const module = await commonService.getModuleById(request.moduleId);

        await commonService.runValidationBefore(
            request.data,
            module.id,
            actionId.create,
            user,
        );

        await commonService.insertFile(files, module.id);
        const data = await commonService.insertData(module.name, request.data);

        await commonService.runValidationAfter(
            request.data,
            module.id,
            actionId.create,
            user,
        );

        t.commit();
        return res.status(statusCode.OK).send(data);
    } catch (error) {
        await t.rollback();
        const response = helper.getErrorResponse(error.message);
        await helper.insertError(req, response.code, error.message);
        return res.status(response.code).send(response.message);
    }
}

async function update(req, res) {
    const t = await db.sequelize.transaction();

    try {
        const request = JSON.parse(req.body.data);
        const files = req.files;

        const module = await commonService.getModuleById(request.moduleId);
        const fields = await commonService.getModuleFields(module.id);
        const detailData = await commonService.getDetailData(
            module.id,
            request.rowId,
            null,
            {
                withValidation: false,
            },
        );

        const primaryField = fields.find(field => field.identity);

        await commonService.deleteFile(fields, detailData);
        await commonService.insertFile(files, module.id);

        const data = await commonService.updateData(
            primaryField.name,
            request.rowId,
            request.data,
        );

        t.commit();
        return res.status(statusCode.OK).send(data);
    } catch (error) {
        await t.rollback();
        const response = helper.getErrorResponse(error.message);
        await helper.insertError(req, response.code, error.message);
        return res.status(response.code).send(response.message);
    }
}

async function menu(req, res) {
    try {
        const token = req.header('Authorization');

        const user = helper.decodeToken(token);
        const data = await commonService.getMenu(user.roleId);

        return res.status(statusCode.OK).send(data);
    } catch (error) {
        const response = helper.getErrorResponse(error.message);
        await helper.insertError(req, response.code, error.message);
        return res.status(response.code).send(response.message);
    }
}

module.exports = {
    columns,
    create,
    destory,
    detail,
    menu,
    options,
    rows,
    update,
};
