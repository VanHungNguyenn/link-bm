const express = require('express')
const mongoose = require('mongoose')
// const bodyParser = require('body-parser');
var cron = require('node-cron')
const config = require('config')
const app = express()

// Bodyparser Middleware
app.use(express.json())

// DB Config
const db = config.get('mongoURI')

// Connect to Mongo
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err))

// Use Routes
app.use('/api/items', require('./routes/api/items'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/fbmark', require('./routes/api/fbmark/actions'))
app.use('/api/taikhoan', require('./routes/api/taikhoan/taikhoan'))
// var runnaptien = require('./cron_data/runnaptien');
var runmuasanpham = require('./cron_data/runmuasanpham')
runmuasanpham()
cron.schedule('* * * * *', () => {
	try {
		// runnaptien();
	} catch (e) {
		console.log(e)
	}
})
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))
