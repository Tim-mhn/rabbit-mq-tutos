import { connect, Connection } from 'amqplib/callback_api';

const message = process.argv.slice(2).join(' ') || 'Hello World!';
connect('amqp://localhost', (error: Error, connection: Connection) => {
  if (error) throw error;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const exchangeName = 'logs';

    channel.assertExchange(exchangeName, 'fanout', { durable: false });

    const noSpecificQueue = '';
    channel.publish(exchangeName, noSpecificQueue, Buffer.from(message), {
      persistent: true,
    });

    console.log(`sent message ${message} to exchange ${exchangeName}`);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
