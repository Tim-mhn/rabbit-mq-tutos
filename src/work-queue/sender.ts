import { connect, Connection } from 'amqplib/callback_api';

const message = process.argv.slice(2).join(' ') || 'Hello World!';
connect('amqp://localhost', (error: Error, connection: Connection) => {
  if (error) throw error;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const queue = 'work_queue';

    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log('sent message to work queue ', message);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
