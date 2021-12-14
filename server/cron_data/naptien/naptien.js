var axios = require('axios');
var request = require('request');
var fs = require('fs');
const { base64encode, base64decode } = require('nodejs-base64');
const LichSuNapTien = require('../../models/lichsunaptien');
const Notifi = require('../../models/notifi');
const User = require('../../models/User');
const getBank = () => {
	new Promise((resolve, reject) =>{
		Notifi.find()
		.sort({ date: -1 })
		.then((items) => {
			if (items.length > 0) {
				if (items[0].cookie_bank !== '' && items[0].data_bank !== '' && items[0].url_bank !== '') {
					checkGiaoDich(items[0].cookie_bank, items[0].data_bank, items[0].url_bank);
				}
			}
		}).catch(err=>{console.log(err)})
	});
}
async function checkGiaoDich(cookie, data, url){
	var form = decodeURI(data).split('&');
	var form_1 = cookie.split('\n');
	var pr = {};
	await form.forEach(function(value,index){
		var bc = value.split('=');
		pr[bc[0]] = bc[1];
	});
	var header = {};
	await form_1.forEach(function(value,index){
		var bc = value.split(': ');
		var bm = bc[0].toLowerCase();
		header[bm] = bc[1];
	});

	var options = {
	  method: 'POST',
	  url: url,
	  headers: header,
	  form: pr,
	};
	request(options, function (error, response, body) {
		try{
			var data = JSON.parse(body);
	  		console.log(data.ChiTietGiaoDich[0]);
	  		xuLyGiaoDich(data.ChiTietGiaoDich[0]);
		} catch(e){
			console.log(e);
		}
	});
}
function xuLyGiaoDich(data){
	var noidungchuyentien = data.MoTa.toLowerCase();
	var match = /naptien ([0-9]+)/;
	try{
		var timkiem = match.exec(noidungchuyentien)[1];
		if (timkiem !== '') {
			var stt_user = timkiem;
			var monney = data.SoTienGhiCo.replace(',','');
			User.find({ stt: stt_user})
			.sort({ date: -1 })
			.then((items) => {
				if (items.length > 0) {
					LichSuNapTien.find({ ma_nap: data.SoThamChieu})
						.sort({ date: -1 })
						.then((lichsu) => {
							if (lichsu.length <= 0) {
								const newLichSuNapTien = new LichSuNapTien({
									id_user: items[0]._id,
									name_user: items[0].name,
									ma_nap: data.SoThamChieu,
									noidung:  data.MoTa,
									tien_nap:  parseInt(monney)
								});
								newLichSuNapTien.save().then(setting => {
									var userupdate = {
										tongtiennap: parseInt(items[0].tongtiennap) + parseInt(monney),
										balance: parseInt(items[0].balance) + parseInt(monney)
									}
									User.findOneAndUpdate({_id: items[0]._id}, userupdate, {upsert: true}, function(err, doc) {
									    if (err){
									    	console.log(err);
									    }
									});
								});
							}
						}).catch(err=>{console.log(err)})
				}
			}).catch(err=>{console.log(err)})
		}
	} catch(e){
		console.log(e);
	}
}
module.exports = getBank;