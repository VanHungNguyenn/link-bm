const express = require('express')
const mongoose = require('mongoose')
// const bodyParser = require('body-parser');
var cron = require('node-cron')
const config = require('config')
const app = express()
const handleAutoMomoRecharge = require('./cron_data/momoAndBank/momoRecharge')
const handleAutoBankRecharge = require('./cron_data/momoAndBank/bankRecharge')

// Bodyparser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// DB Config
const db = config.get('mongoURI')

mongoose.connect(
	db,
	{
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useNewUrlParser: true,
	},
	(err) => {
		if (err) throw err
		console.log('Connected to mongodb')
	}
)

// Use Routes
app.use('/api/items', require('./routes/api/items')) // Ko sử dụng
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/fbmark', require('./routes/api/fbmark/actions'))
app.use('/api/taikhoan', require('./routes/api/taikhoan/taikhoan'))

// var runnaptien = require('./cron_data/runnaptien');
var runmuasanpham = require('./cron_data/runmuasanpham')
runmuasanpham()

// handleAutoMomoRecharge()
// handleAutoBankRecharge()

cron.schedule('* * * * *', () => {
	try {
		handleAutoMomoRecharge()
		handleAutoBankRecharge()
	} catch (err) {
		console.log(err)
	}
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))
