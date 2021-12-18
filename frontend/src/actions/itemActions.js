import axios from 'axios'
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from './types'
import { returnErrors } from './errorActions'
import { loadUser } from './authActions'
import fs from 'fs'
import CryptoJS from 'crypto-js'
var options = {
	iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000'),
	mode: CryptoJS.mode.CBC,
	padding: CryptoJS.pad.Pkcs7,
}
export const getItems = () => (dispatch, getState) => {
	const token = getState().auth.token
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}
	if (token) {
		dataPass.headers['zi-token'] = token
	}
	axios.get('/api/fbmark/categoryproduct', dataPass).then((res) => {
		dispatch({
			type: GET_ITEMS,
			payload: res.data,
		})
		// if (token) {
		// dispatch(getProductByCategoryClient());
		// } else {
		// dispatch(getProductByCategoryClientNo());
		// }
	})
}

export const getItemsAdmin =
	(listtype = '') =>
	(dispatch, getState) => {
		const token = getState().auth.token
		const dataPass = {
			headers: {
				'Content-type': 'application/json',
			},
		}
		if (token) {
			dataPass.headers['zi-token'] = token
		}
		axios.get('/api/fbmark/categoryproduct', dataPass).then((res) => {
			dispatch({
				type: GET_ITEMS,
				payload: res.data,
			})
			dispatch(getProductByCategory(listtype))
		})
	}
export const laylichsumuaadmin = () => (dispatch, getState) => {
	const token = getState().auth.token
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}
	if (token) {
		dataPass.headers['zi-token'] = token
	}

	axios.get('/api/fbmark/adminlogs', dataPass).then((res) => {
		dispatch({
			type: 'ADMIN_LAY_LICH_SU_MUA',
			payload: res.data,
		})
	})
}

export const laylichsumuauser = () => (dispatch, getState) => {
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}

	axios.get('/api/fbmark/userlogs', dataPass).then((res) => {
		dispatch({
			type: 'USER_LAY_LICH_SU_MUA',
			payload: res.data,
		})
	})
}

export const laytongdoanhthu = () => (dispatch, getState) => {
	const token = getState().auth.token
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}
	if (token) {
		dataPass.headers['zi-token'] = token
	}

	axios.get('/api/fbmark/admintongdoanhthu', dataPass).then((res) => {
		dispatch({
			type: 'ADMIN_LAY_TONG_DOANH_THU',
			payload: res.data,
		})
	})
}
export const layThongBao = () => (dispatch, getState) => {
	const token = getState().auth.token
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}
	if (token) {
		dataPass.headers['zi-token'] = token
	}
	axios.get('/api/fbmark/notifi', dataPass).then((res) => {
		if (res.data.length > 0) {
			dispatch({
				type: 'CHANGE_CONFIG',
				payload: res.data[0],
			})
		}
	})
}
export const laythongbaoadmin = () => (dispatch, getState) => {
	const token = getState().auth.token
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}
	if (token) {
		dataPass.headers['zi-token'] = token
	}
	axios.get('/api/fbmark/notifi', dataPass).then((res) => {
		dispatch({
			type: 'CHANGE_CONFIG',
			payload: res.data,
		})
	})
}
export const changeConfig = (data) => (dispatch, getState) => {
	dispatch({
		type: 'CHANGE_CONFIG',
		payload: data,
	})
}

export const layThongBaoClient = () => (dispatch, getState) => {
	const token = getState().auth.token
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}
	if (token) {
		dataPass.headers['zi-token'] = token
	}
	axios.get('/api/fbmark/notifidisplay', dataPass).then((res) => {
		dispatch({
			type: 'LAY_THONG_BAO',
			payload: res.data,
		})
	})
}
export const laylichsunapadmin = () => (dispatch, getState) => {
	const token = getState().auth.token
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}
	if (token) {
		dataPass.headers['zi-token'] = token
	}
	axios.get('/api/fbmark/adminlichsunaptien', dataPass).then((res) => {
		dispatch({
			type: 'ADMIN_LAY_LICH_SU_NAP',
			payload: res.data,
		})
	})
}

export const laylichsunapuser = () => (dispatch, getState) => {
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}

	axios.get('/api/fbmark/userlichsunaptien', dataPass).then((res) => {
		dispatch({
			type: 'USER_LAY_LICH_SU_NAP',
			payload: res.data,
		})
	})
}

export const layThongBaoNapTien = () => (dispatch, getState) => {
	const token = getState().auth.token
	if (token !== null) {
		const dataPass = {
			params: {
				idUser: getState().auth.user._id,
			},
			headers: {
				'Content-type': 'application/json',
			},
		}
		if (token) {
			dataPass.headers['zi-token'] = token
		}
		axios.get('/api/fbmark/notifilogs', dataPass).then((res) => {
			if (res.data.status === 200) {
				var mess =
					'Bạn đã nạp thành công số tiền ' +
					res.data.data[0].tien_nap +
					' VNĐ'
				dispatch(
					returnErrors(mess, res.data.status, 'NAP_TIEN_SUCCESS')
				)
				dispatch(loadUser())
			}
		})
	}
}
export const layGiaoDich = () => (dispatch, getState) => {
	const token = getState().auth.token
	if (token !== null) {
		const dataPass = {
			params: {
				idUser: getState().auth.user._id,
			},
			headers: {
				'Content-type': 'application/json',
			},
		}
		if (token) {
			dataPass.headers['zi-token'] = token
		}
		axios
			.get('/api/fbmark/thongtingiaodich', dataPass)
			.then((res) => {
				if (res.data.status === 200) {
					var mess = res.data.msg
					dispatch(
						returnErrors(mess, res.data.status, 'GIAO_DICH_SUCCESS')
					)
					dispatch(loadUser())
				} else {
					var mess = res.data.msg
					// dispatch(layGiaoDich());
					dispatch(
						returnErrors(mess, res.data.status, 'GIAO_DICH_FAIL')
					)
					dispatch(loadUser())
				}
			})
			.catch((err) => {
				dispatch(layGiaoDich())
			})
	}
}
export const laylichsunaptien = () => (dispatch, getState) => {
	const token = getState().auth.token
	if (token !== null) {
		const dataPass = {
			params: {
				idUser: getState().auth.user._id,
			},
			headers: {
				'Content-type': 'application/json',
			},
		}
		if (token) {
			dataPass.headers['zi-token'] = token
		}
		axios.get('/api/fbmark/lichsunaptien', dataPass).then((res) => {
			dispatch({
				type: 'LAY_LICH_SU_NAP',
				payload: res.data,
			})
		})
	}
}
export const getProductByCategory =
	(listtype = '') =>
	(dispatch, getState) => {
		const token = getState().auth.token
		const dataPass = {
			params: {
				idUser: getState().auth.user._id,
				listtype: listtype,
			},
			headers: {
				'Content-type': 'application/json',
			},
		}
		if (token) {
			dataPass.headers['zi-token'] = token
		}
		dispatch({
			type: ITEMS_LOADING,
			payload: true,
		})
		axios.get('/api/fbmark/product', dataPass).then((res) => {
			dispatch({
				type: 'GET_PRODUCT_ADMIN',
				payload: res.data,
			})
			dispatch({
				type: ITEMS_LOADING,
				payload: false,
			})
		})
	}

export const getProductByCategoryClient = () => (dispatch, getState) => {
	const token = getState().auth.token
	const dataPass = {
		params: {
			idUser: getState().auth.user._id,
		},
		headers: {
			'Content-type': 'application/json',
		},
	}
	if (token) {
		dataPass.headers['zi-token'] = token
	}
	axios.get('/api/fbmark/productclient', dataPass).then((res) => {
		dispatch({
			type: 'GET_PRODUCT',
			payload: res.data,
		})
	})
}

export const getProductByCategoryClientNo = () => (dispatch, getState) => {
	const dataPass = {
		headers: {
			'Content-type': 'application/json',
		},
	}
	axios.get('/api/fbmark/productclientno', dataPass).then((res) => {
		dispatch({
			type: 'GET_PRODUCT',
			payload: res.data,
		})
	})
}

export const laylichsumua = () => (dispatch, getState) => {
	const token = getState().auth.token
	const dataPass = {
		params: {
			idUser: getState().auth.user._id,
		},
		headers: {
			'Content-type': 'application/json',
		},
	}
	if (token) {
		dataPass.headers['zi-token'] = token
	}

	axios.get('/api/fbmark/logs', dataPass).then((res) => {
		dispatch({
			type: 'LAY_LICH_SU_MUA',
			payload: res.data,
		})
	})
}

export const cLinkBM =
	(linkbm, luong, cookie, token_bm) => (dispatch, getState) => {
		const token = getState().auth.token
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'zi-token': token,
			},
		}
		var body = {
			linkbm: linkbm,
			luong: luong,
		}
		axios
			.post('/api/fbmark/checklinkbm', body, config)
			.then((res) => {
				if (res.data.status === 200) {
					res.data.data.linkbm = linkbm
					if (token_bm !== '') {
						dispatch(checklinkbm1(res.data.data, cookie, token_bm))
					} else {
						dispatch({
							type: 'DATA_CHECK_BM',
							payload: res.data.data,
						})
					}
				}
			})
			.catch((err) => {})
	}
export const cIDBM =
	(id_bm, luong, cookie, token_bm) => (dispatch, getState) => {
		var data = {
			businessID: id_bm,
			linkbm: '',
		}
		dispatch(checklinkbm1(data, cookie, token_bm))
	}
export const checklinkbm1 = (data, cookie, token) => (dispatch, getState) => {
	const dataPass = {
		params: {
			fields: '["name,sharing_eligibility_status,can_create_ad_account"]',
			locale: 'en_US',
			pretty: 0,
			suppress_http_code: 1,
			access_token: token,
		},
	}
	axios
		.get('https://graph.facebook.com/v4.0/' + data.businessID, dataPass)
		.then((res) => {
			var returnedTarget = Object.assign(data, res.data)
			dispatch(checklinkbm2(returnedTarget, cookie))
		})
}

export const checklinkbm2 = (data, cookie) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	var body = {
		id_busi: data.businessID,
		cookie: cookie,
	}
	axios
		.post('/api/fbmark/checklinkbmstep', body, config)
		.then((res) => {
			var returnedTarget = Object.assign(data, res.data.data)
			dispatch({
				type: 'DATA_CHECK_BM',
				payload: returnedTarget,
			})
		})
		.catch((err) => {})
}

export const muaTaikhoan =
	(
		id_category,
		sl,
		totalpriceuser,
		name_category,
		description_category,
		price_buy,
		tienmua
	) =>
	(dispatch, getState) => {
		const token = getState().auth.token
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'zi-token': token,
			},
		}
		const body = {
			sl: parseInt(sl),
			id_category: id_category,
			id_user: getState().auth.user._id,
			user_name: getState().auth.user.name,
			price: totalpriceuser,
			price_buy: price_buy,
			name_category: name_category,
			tienmua: tienmua,
			description_category: description_category,
			date_buy: Date.now(),
		}
		var encrypted = CryptoJS.AES.encrypt(
			JSON.stringify(body),
			CryptoJS.enc.Base64.parse('khongthehackduoc'),
			options
		).ciphertext.toString(CryptoJS.enc.Base64)
		axios
			.post('/api/fbmark/buyproduct', { params: encrypted }, config)
			.then((res) => {
				if (res.data.status === 200) {
					dispatch(layGiaoDich())
					dispatch(
						returnErrors(
							res.data.msg,
							res.data.status,
							'MUA_TK_SUCCESS'
						)
					)
				} else {
					dispatch(
						returnErrors(
							res.data.msg,
							res.data.status,
							'MUA_TK_FAIL'
						)
					)
				}
				dispatch(getItems())
				dispatch(loadUser())
			})
			.catch((err) => {})
	}

export const saveCategoryProduct = (data) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	axios
		.post('/api/fbmark/addcategoryproduct', data, config)
		.then((res) => {
			if (res.data.status == 200) {
				dispatch(
					returnErrors(res.data.msg, 200, 'ADD_CATEGORY_SUCCESS')
				)
				dispatch(getItems())
			} else {
				dispatch(
					returnErrors(res.data.msg, 400, 'ADD_CATEGORY_TK_FAIL')
				)
			}
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi lưu loại sản phẩm',
					400,
					'ADD_CATEGORY_TK_FAIL'
				)
			)
		})
}

export const saveProduct =
	(data, listtype = '') =>
	(dispatch, getState) => {
		const token = getState().auth.token
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'zi-token': token,
			},
		}
		axios
			.post('/api/fbmark/addproduct', data, config)
			.then((res) => {
				if (res.data.status == 200) {
					dispatch(
						returnErrors(res.data.msg, 200, 'ADD_PRODUCT_SUCCESS')
					)
					dispatch(getItems())
					dispatch(getItemsAdmin(listtype))
				} else {
					dispatch(
						returnErrors(res.data.msg, 400, 'ADD_PRODUCT_TK_FAIL')
					)
				}
			})
			.catch((err) => {
				dispatch(
					returnErrors(
						'Có lỗi xảy ra khi lưu sản phẩm',
						400,
						'ADD_PRODUCT_TK_FAIL'
					)
				)
			})
	}

export const editStatusProduct =
	(data, listtype = '') =>
	(dispatch, getState) => {
		const token = getState().auth.token
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'zi-token': token,
			},
		}
		axios
			.post('/api/fbmark/editstatusproduct', data, config)
			.then((res) => {
				if (res.data.status == 200) {
					dispatch(
						returnErrors(
							res.data.msg,
							200,
							'EDIT_STATUS_PRODUCT_SUCCESS'
						)
					)
					dispatch(getItems())
					dispatch(getItemsAdmin(listtype))
				} else {
					dispatch(
						returnErrors(
							res.data.msg,
							400,
							'EDIT_STATUS_PRODUCT_TK_FAIL'
						)
					)
				}
			})
			.catch((err) => {
				dispatch(
					returnErrors(
						'Có lỗi xảy ra khi lưu sản phẩm',
						400,
						'EDIT_STATUS_PRODUCT_TK_FAIL'
					)
				)
			})
	}

export const saveThongBao = (des) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	var data = {
		id_user: getState().auth.user._id,
		noidung: des,
	}
	axios
		.post('/api/fbmark/addnotifi', data, config)
		.then((res) => {
			if (res.data.status == 200) {
				dispatch(returnErrors(res.data.msg, 200, 'ADD_NOTIFI_SUCCESS'))
				dispatch(laythongbaoadmin())
			}
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi thêm thông báo',
					400,
					'ADD_NOTIFI_FAIL'
				)
			)
		})
}
export const saveConfig = (data) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	data.id_user = getState().auth.user._id
	axios
		.post('/api/fbmark/addnotifi', data, config)
		.then((res) => {
			if (res.data.status == 200) {
				dispatch(layThongBao())
				dispatch(returnErrors(res.data.msg, 200, 'SAVE_NOTIFI_SUCCESS'))
			}
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi lưu thông báo',
					400,
					'SAVE_NOTIFI_FAIL'
				)
			)
		})
}
export const deleteCategoryProduct = (ids) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	axios
		.post('/api/fbmark/deletecategoryproduct', ids, config)
		.then((res) => {
			if (res.data.status == 200) {
				dispatch(
					returnErrors(res.data.msg, 200, 'DELETE_CATEGORY_SUCCESS')
				)
				dispatch(getItems())
			}
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi xóa thông báo',
					400,
					'DELETE_CATEGORY_TK_FAIL'
				)
			)
		})
}
export const xoaThongbao = (ids) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	axios
		.post('/api/fbmark/deletenotifi', ids, config)
		.then((res) => {
			if (res.data.status == 200) {
				dispatch(
					returnErrors(res.data.msg, 200, 'DELETE_NOTIFI_SUCCESS')
				)
				dispatch(laythongbaoadmin())
			}
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi xóa thông báo',
					400,
					'DELETE_NOTIFI_FAIL'
				)
			)
		})
}
export const deleteProductMulti = (ids) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	axios
		.post('/api/fbmark/deleteproduct', ids, config)
		.then((res) => {
			if (res.data.status == 200) {
				dispatch(
					returnErrors(res.data.msg, 200, 'DELETE_PRODUCT_SUCCESS')
				)
				dispatch(getItems())
				dispatch(getItemsAdmin('chuaban'))
			}
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi xóa sản phẩm',
					400,
					'DELETE_PRODUCT_TK_FAIL'
				)
			)
		})
}
export const downloadProduct = (ids, title, sl) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	const body = {
		ids: ids,
		id_user: getState().auth.user._id,
	}
	axios
		.post('/api/fbmark/downloadproduct', body, config)
		.then((res) => {
			if (res.data.length > 0) {
				var content = ''
				res.data.forEach(function (value, index) {
					content += value.data + '\n'
				})
				var tenfile = title + ' - số lượng:' + sl
				download(content, '' + tenfile + '.txt', 'text/plain')
			}
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi tải xuống',
					400,
					'DOWNLOAD_TK_FAIL'
				)
			)
		})
}
export const veiwProduct = (ids) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	const body = {
		ids: ids,
		id_user: getState().auth.user._id,
	}
	axios
		.post('/api/fbmark/viewproduct', body, config)
		.then((res) => {
			dispatch({
				type: 'VIEW_PRODUCT',
				payload: res.data,
			})
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi xem chi tiết',
					400,
					'VIEW_PRODUCT_FAIL'
				)
			)
		})
}

export const veiwProductAdmin = (ids) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	const body = {
		ids: ids,
		id_user: getState().auth.user._id,
	}
	axios
		.post('/api/fbmark/viewproductadmin', body, config)
		.then((res) => {
			dispatch({
				type: 'VIEW_PRODUCT',
				payload: res.data,
			})
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi xem chi tiết',
					400,
					'VIEW_PRODUCT_FAIL'
				)
			)
		})
}
export const addItem = (item) => (dispatch) => {
	axios.post('/api/items', item).then((res) =>
		dispatch({
			type: ADD_ITEM,
			payload: res.data,
		})
	)
}

export const deleteItem = (id) => (dispatch) => {
	axios.delete(`/api/items/${id}`).then((res) =>
		dispatch({
			type: DELETE_ITEM,
			payload: id,
		})
	)
}

export const getTotalMoney = (data) => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	axios
		.post('/api/fbmark/gettotalmoney', data, config)
		.then((res) => {
			if (res.data.status == 200) {
				dispatch({
					type: 'TOTAL_MONEY',
					payload: res.data.data,
				})
			}
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi lưu sản phẩm',
					400,
					'ADD_PRODUCT_TK_FAIL'
				)
			)
		})
}

export const getProductLoi = () => (dispatch, getState) => {
	const token = getState().auth.token
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'zi-token': token,
		},
	}
	axios
		.get('/api/fbmark/getproductloi', config)
		.then((res) => {
			if (res.data.status == 200) {
				dispatch({
					type: 'LIST_PRODUCT_LOI',
					payload: res.data.data,
				})
			}
		})
		.catch((err) => {
			dispatch(
				returnErrors(
					'Có lỗi xảy ra khi lưu sản phẩm',
					400,
					'ADD_PRODUCT_TK_FAIL'
				)
			)
		})
}

export const setItemsLoading = () => {
	return {
		type: ITEMS_LOADING,
	}
}
function download(data, filename, type) {
	var file = new Blob([data], { type: type })
	if (window.navigator.msSaveOrOpenBlob)
		// IE10+
		window.navigator.msSaveOrOpenBlob(file, filename)
	else {
		// Others
		var a = document.createElement('a'),
			url = URL.createObjectURL(file)
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		setTimeout(function () {
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)
		}, 0)
	}
}
