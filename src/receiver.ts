import { connect } from 'amqplib/callback_api';

connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const queue = 'hello';
    channel.assertQueue(queue, { durable: false });

    channel.consume(
      queue,
      (message) =>
        console.log('Received message ', message?.content.toString()),
      { noAck: true }
    );
  });
});
