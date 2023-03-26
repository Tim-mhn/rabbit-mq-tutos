import { connect } from 'amqplib/callback_api';

const args = process.argv.splice(2);

connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const exchangeName = 'logs';

    channel.assertExchange(exchangeName, 'direct', { durable: false });
    channel.assertQueue('', { exclusive: true }, (err, q) => {
      if (err) throw err;

      const severityList = args;

      severityList.forEach((severity) => {
        console.log(
          `Listening to exchange ${exchangeName} of severity ${severity}`
        );
        channel.bindQueue(q.queue, exchangeName, severity);
      });

      channel.consume(
        q.queue,
        (message) =>
          console.log(
            `Received ${message?.content.toString()} severity [${
              message?.fields.routingKey
            }]`
          ),
        { noAck: true }
      );
    });
  });
});
