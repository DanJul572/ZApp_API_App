const dayjs = require('dayjs');

const db = require('@db');
const enums = require('@enums');
const commonBuilder = require('@builders/commonBuilder');

async function getRows(moduleName, fields, page, filter, sort, defaultFilter) {
  try {
    if (!sort || sort.length <= 0) {
      const primaryField = await fields.find(field => field.identity);
      sort = [
        {
          id: primaryField.name,
          desc: false,
        },
      ];
    }

    const countQuery = commonBuilder.getRowsCount(moduleName);
    const {rowsQuery, rowsValues} = commonBuilder.getRows(
      moduleName,
      fields,
      page,
      filter,
      sort,
      defaultFilter,
    );

    const count = await db.sequelize
      .query(countQuery)
      .then(result => {
        return result.length > 0 ? parseInt(result[0][0].count) : 0;
      })
      .catch(error => {
        throw new Error(error.message);
      });

    const rows = await db.sequelize
      .query(rowsQuery, {
        bind: rowsValues,
        type: db.sequelize.QueryTypes.SELECT,
      })
      .then(result => {
        return result.length > 0 ? result : [];
      })
      .catch(error => {
        throw new Error(error.message);
      });

    return {
      count: count,
      rows: rows,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getRowDetail(tableName, rowId, primaryFieldName) {
  try {
    const query = commonBuilder.getRowDetail(tableName, primaryFieldName);

    return await db.sequelize
      .query(query, {
        bind: [rowId],
        type: db.sequelize.QueryTypes.SELECT,
      })
      .then(result => {
        return result.length > 0 ? result[0] : null;
      })
      .catch(error => {
        throw new Error(error.message);
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteRow(tableName, primaryFieldName, rowId, transaction) {
  try {
    const query = commonBuilder.deleteRow(tableName, primaryFieldName, rowId);

    return await db.sequelize
      .query(query, {
        bind: [rowId],
        transaction,
        type: db.sequelize.QueryTypes.DELETE,
      })
      .then(() => {
        return 'Data has been deleted.';
      })
      .catch(error => {
        throw new Error(error.message);
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getOptions(field) {
  try {
    const query = commonBuilder.getOptions(field.tableRef, field.tableRefKey, field.tableRefName);
    return await db.sequelize
      .query(query)
      .then(result => {
        return result.length > 0 ? result[0] : null;
      })
      .catch(error => {
        throw new Error(error.message);
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function insertRow(table, data, transaction) {
  try {
    data.createdAt = dayjs().format(enums.datetimeFormat.datetime.value);
    data.updatedAt = dayjs().format(enums.datetimeFormat.datetime.value);

    const {query, values} = commonBuilder.insertRow(table, data);

    const queryOptions = {
      bind: values,
      type: db.sequelize.QueryTypes.RAW,
    };

    if (transaction) {
      queryOptions.transaction = transaction;
    }

    const [results] = await db.sequelize.query(query, queryOptions);

    return results[0];
  } catch (error) {
    throw new Error(error.message);
  }
}

async function insertManyRows(table, dataArray, transaction) {
  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error('Data must be a non-empty array of objects');
    }

    const timestamp = dayjs().format(enums.datetimeFormat.datetime.value);

    // Tambahkan createdAt dan updatedAt ke setiap item
    const dataWithTimestamps = dataArray.map(data => ({
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    const {query, values} = commonBuilder.insertManyRows(table, dataWithTimestamps);

    await db.sequelize.query(query, {
      bind: values,
      transaction,
      type: db.sequelize.QueryTypes.INSERT,
    });

    return 'Data has been created.';
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateRow(moduleName, primaryFieldName, rowId, data, transaction) {
  try {
    const condition = {
      [primaryFieldName]: rowId,
    };

    data.updatedAt = dayjs().format(enums.datetimeFormat.datetime.value);

    const {query, values} = commonBuilder.updateRow(moduleName, data, condition);

    return await db.sequelize
      .query(query, {
        bind: values,
        transaction,
        type: db.sequelize.QueryTypes.UPDATE,
      })
      .then(() => {
        return 'Data has been updated.';
      })
      .catch(error => {
        throw new Error(error.message);
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getMenu(roleId) {
  try {
    const query = commonBuilder.getMenu();

    return await db.sequelize
      .query(query, {
        bind: [roleId],
        type: db.sequelize.QueryTypes.SELECT,
      })
      .then(result => {
        return result.length > 0 ? result[0] : null;
      })
      .catch(error => {
        throw new Error(error.message);
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getRows,
  getRowDetail,
  deleteRow,
  getOptions,
  insertRow,
  insertManyRows,
  updateRow,
  getMenu,
};
