const nr = require('newrelic')
const Redis = require('ioredis')
const express = require('express')
const heapdump = require('heapdump')
const app = express()

const httpServer = require('http').createServer(app)

const io = require('socket.io')(httpServer)

const port = 5000

// const redis = new Redis({host:'redis'})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
	nr.startWebTransaction('/chat', function handle() {
		console.log('a user connected')

		const tr = nr.getTransaction()

		socket.on('disconnect', () => {
			console.log('user disconnected')
			tr.end()
		})

		socket.on('chat message', (msg) => {
			console.log('msg: ', msg)
		})
	})

		// nr.startBackgroundTransaction('chat', function handle() {
		// 	const tr = nr.getTransaction()
		// 	// redis.xadd('pdx.chat', '*', 'msg', msg)
		// 	// .then((id) => {
		// 	// 	console.log('id: ', id)
		// 	// })

		// 	// redis.set('foo', msg).then((result) => 
		// 	// 	{
		// 	// 		console.log('foo result: ', result)
		// 	// 		tr.end() // end transaction
		// 	// 	}
		// 	// )
		// 	console.log('got this: ', msg)
		// 	tr.end()
		// })

})

httpServer.listen(port, () => {
		console.log(`express app listening at ${port}`)
})

setTimeout(() => {
	heapdump.writeSnapshot(__dirname + '/yesrelic_dump_2_' + Date.now() + '.heapsnapshot')
}, 400000)
