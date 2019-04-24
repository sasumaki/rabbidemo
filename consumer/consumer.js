

const amqp = require('amqplib/callback_api')
const fs = require('fs')

amqp.connect(process.env.RABBIT_URI, (err, connection) => {
  connection.createChannel((err1, channel) => {
    let queue = 'task_queue'
    channel.assertQueue(queue, { durable: true })
    channel.prefetch(1)

    channel.consume(queue, function (msg) {
      setTimeout(function () {
        if (Math.random() < 0.025) {
          console.log('crash')
          process.exit(1)
        }
        fs.appendFile('progress.txt', `${msg.content.toString()}\n`, function (err) {
          if (err) throw err;
        });
        channel.ack(msg)
      }, 200)
    }, {
        noAck: false
      });
  })
  connection.createChannel((err1, channel) => {
    let queue = 'prio_que'
    channel.assertQueue(queue, { durable: true })
    channel.prefetch(1)

    channel.consume(queue, function (msg) {

      setTimeout(function () {
        if (Math.random() < 0.025) {
          console.log('crash')
          process.exit(1)
        }
        fs.appendFile('progress.txt', `${msg.content.toString()}\n`,  function (err) {
          if (err) throw err;
        });
        channel.ack(msg)
      }, 200)
    }, {
        noAck: false
      });
  });
})
