const amqp = require('amqplib');

let connection = null;
let channel = null;

async function connect() {
  try {
    if (channel) return;

    const rabbitmqUrl = process.env.RABBITMQ_URL;
    if (!rabbitmqUrl) {
      console.warn('RabbitMQ disabled: no URL provided');
      return;
    }

    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    console.log('RabbitMQ connected');
  } catch (err) {
    console.error('RabbitMQ connection failed:', err.message);
  }
}

async function sendToQueue(queueName, message) {
  if (!channel) {
    await connect();
  }

  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
}

async function deleteQueue(queueName) {
  if (!channel) {
    await connect();
  }

  await channel.deleteQueue(queueName);
}

async function close() {
  if (connection) {
    await connection.close();
  }
}

module.exports = {
  connect,
  sendToQueue,
  deleteQueue,
  close,
};
