
const amqp = require('amqplib/callback_api')
const fs = require('fs')

const publish = (channel, queue) => {
  for (let i = 0; i < 1000; i++) {
    channel.sendToQueue(queue, Buffer.from(String(i)), { persistent: true })
  }
}
const publishPrio = (channel, queue) => {
  channel.sendToQueue(queue, Buffer.from('PRIOPRIOSOS'), { persistent: true })
}
amqp.connect(process.env.RABBIT_URI, (err, connection) => {
  connection.createChannel((err1, channel) => {
    let queue = 'task_queue'
    channel.assertQueue(queue, { durable: true })
    publish(channel, queue)
    setInterval(() => {
      publish(channel, queue)
    }, 180 * 1000)
  })
  connection.createChannel((err1, channel) => {
    let queue = 'prio_que'
    channel.assertQueue(queue, { durable: true })
    publishPrio(channel, queue)
    setInterval(() => {
      publishPrio(channel, queue)
    }, 5 * 1000)
  })
})