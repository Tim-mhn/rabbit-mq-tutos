import { connect, Connection } from 'amqplib/callback_api';

connect('amqp://localhost', (error: Error, connection: Connection) => {
  if (error) throw error;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const queue = 'hello';
    const message = 'hello world';

    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message));

    console.log('sent message ', message);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
