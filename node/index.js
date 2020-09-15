const nr = require('newrelic')
const Redis = require('ioredis')
const express = require('express')
// const heapdump = require('heapdump')
const app = express()

const httpServer = require('http').createServer(app)

const io = require('socket.io')(httpServer)

const port = 5000

const redis = new Redis({host:'redis'})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
	console.log('a user connected')

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})

	socket.on('chat message', (msg) => {

		nr.startBackgroundTransaction('chat', function handle() {
			const tr = nr.getTransaction()
			redis.xadd('pdx.chat', '*', 'msg', msg)
			.then((id) => {
				console.log('id: ', id)
			})

			redis.set('foo', msg).then((result) => 
				{
					console.log('foo result: ', result)
					tr.end() // end transaction
				}
			)
		})

    console.log('message: ' + msg);
  })
})

httpServer.listen(port, () => {
		console.log(`express app listening at ${port}`)
})
