import { connect, Connection } from 'amqplib/callback_api';

const args = process.argv.slice(2);

const [severity, ...log] = args;
const logMessage = log.join(' ');

connect('amqp://localhost', (error: Error, connection: Connection) => {
  if (error) throw error;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const exchangeName = 'logs';

    channel.assertExchange(exchangeName, 'direct', { durable: false });

    channel.publish(exchangeName, severity, Buffer.from(logMessage), {
      persistent: true,
    });

    console.log(`Sent log '${logMessage}' of severity [${severity}]`);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
