const mongoose = require('mongoose');
var axios = require('axios');
const config = require('config');
// const setting = require('./settings/settings');
const naptien = require('./naptien/naptien');

const run = () =>{
	var data_bank = naptien();
	// var data_setting = setting();
}
module.exports = run;