const {createClient} = require('redis');

const createRedisClient = async () => {
    const client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    return client;
};

const setValue = async (key, value) => {
    const client = await createRedisClient();
    await client.set(key, value);
    await client.quit();
};

const getValue = async key => {
    const client = await createRedisClient();
    const value = await client.get(key);
    await client.quit();
    return value;
};

const removeValue = async key => {
    const client = await createRedisClient();
    await client.del(key);
    await client.quit();
};

module.exports = {
    setValue,
    getValue,
    removeValue,
};
