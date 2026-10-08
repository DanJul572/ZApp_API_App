const amqp = require('amqplib');

let connection = null;
let channel = null;
let connecting = null;

// RABBITMQ_URL may carry the credentials itself; otherwise RABBITMQ_USER and RABBITMQ_PASS are
// added to it.
function getUrl() {
  const rabbitmqUrl = process.env.RABBITMQ_URL;
  if (!rabbitmqUrl) return null;

  const url = new URL(rabbitmqUrl);
  if (!url.username && process.env.RABBITMQ_USER) {
    url.username = encodeURIComponent(process.env.RABBITMQ_USER);
    url.password = encodeURIComponent(process.env.RABBITMQ_PASS || '');
  }
  return url.toString();
}

function reset() {
  connection = null;
  channel = null;
}

async function openChannel() {
  const url = getUrl();
  if (!url) {
    console.warn('RabbitMQ disabled: no URL provided');
    return;
  }

  connection = await amqp.connect(url);
  connection.on('error', err => console.error('RabbitMQ connection error:', err.message));
  connection.on('close', reset);

  // A confirm channel lets sendToQueue wait until the broker has stored the message.
  channel = await connection.createConfirmChannel();
  channel.on('close', () => {
    channel = null;
  });

  console.log('RabbitMQ connected');
}

async function connect() {
  if (channel) return;

  if (!connecting) {
    connecting = openChannel()
      .catch(err => {
        reset();
        console.error('RabbitMQ connection failed:', err.message);
      })
      .finally(() => {
        connecting = null;
      });
  }

  await connecting;
}

async function getChannel() {
  if (!channel) {
    await connect();
  }
  if (!channel) {
    throw new Error('RabbitMQ is not available');
  }
  return channel;
}

/**
 * Sends one message, or an array of messages, to a durable queue and resolves once the broker
 * has confirmed them.
 */
async function sendToQueue(queueName, message) {
  const activeChannel = await getChannel();
  const messages = Array.isArray(message) ? message : [message];

  await activeChannel.assertQueue(queueName, {
    durable: true,
  });

  messages.forEach(item => {
    activeChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(item)), { persistent: true });
  });

  await activeChannel.waitForConfirms();
}

async function deleteQueue(queueName) {
  const activeChannel = await getChannel();
  await activeChannel.deleteQueue(queueName);
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
