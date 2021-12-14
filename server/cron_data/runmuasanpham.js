const mongoose = require('mongoose');
var axios = require('axios');
const config = require('config');
// const setting = require('./settings/settings');
const muasanpham = require('./muasanpham/muasanpham');

const run = () =>{
	var data_bank = muasanpham();
	// var data_setting = setting();
}
module.exports = run;