import { connect } from 'amqplib/callback_api';

connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const queue = 'work_queue';
    channel.assertQueue(queue, { durable: false });

    channel.consume(
      queue,
      (message) =>
        setTimeout(
          () => console.log(`Message ${message?.content.toString()} processed`),
          Math.random() * 3000
        ),
      { noAck: true }
    );
  });
});
