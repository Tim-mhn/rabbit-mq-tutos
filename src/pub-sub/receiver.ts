import { connect } from 'amqplib/callback_api';

connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const exchangeName = 'logs';

    channel.assertExchange(exchangeName, 'fanout', { durable: false });
    channel.assertQueue('', { exclusive: true }, (err, q) => {
      if (err) throw err;

      const allSubQueues = '';
      channel.bindQueue(q.queue, exchangeName, allSubQueues);

      channel.consume(
        q.queue,
        (message) => console.log(`Received ${message?.content.toString()}`),
        { noAck: true }
      );
    });
  });
});
