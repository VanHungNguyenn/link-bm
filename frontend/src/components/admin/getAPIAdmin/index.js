import React from 'react'
import { useSelector } from 'react-redux'
import columnAPI from './columnAPI'

function GetAPIAdmin(props) {
	const user = useSelector((state) => state.auth.user)

	return (
		<div className='content'>
			<div className='block block-rounded block-bordered'>
				<div className='block-header block-header-default border-bottom'>
					<h3 className='block-title'>API</h3>
				</div>
				<div className='block-content'>
					<div className='input-group mb-3'>
						<span className='input-group-text'>KEY: </span>
						<input
							type='text'
							className='form-control'
							placeholder='Secret key'
							aria-label='SecretKey'
							disabled
							defaultValue={user.key ? user.key : ''}
						/>
					</div>
					<div className='api_tutorial'>
						<h5>Hướng dẫn sử dụng: </h5>
						<h6 style={{ marginBottom: 10 }}>Mua sản phẩm: </h6>
						<div className='input-group mb-3'>
							<span className='input-group-text'>GET: </span>
							<input
								type='text'
								className='form-control'
								placeholder='Secret key'
								aria-label='SecretKey'
								disabled
								defaultValue='http://tk24h.com/api/auto/buy_product?key=<KEY>&id=<ID>&sl=<NUMBER>'
							/>
						</div>
						<h6 style={{ marginBottom: 10 }}>
							Kiểm tra tài khoản account:{' '}
						</h6>
						<div className='input-group mb-3'>
							<span className='input-group-text'>GET: </span>
							<input
								type='text'
								className='form-control'
								placeholder='Check account'
								aria-label='CheckAccount'
								disabled
								defaultValue='http://tk24h.com/api/auto/check_balance?key=<KEY>'
							/>
						</div>
						<h6
							style={{
								marginBottom: 10,
							}}
						>
							Kiểm tra số lượng sản phẩm có thể mua:{' '}
						</h6>
						<div className='input-group mb-3'>
							<span className='input-group-text'>GET: </span>
							<input
								type='text'
								className='form-control'
								placeholder='Check amount'
								aria-label='CheckAmount'
								disabled
								defaultValue='http://tk24h.com/api/auto/check_amount?id=<ID>'
							/>
						</div>
						<h6
							style={{
								marginBottom: 10,
							}}
						>
							Thêm sản phẩm:{' '}
						</h6>
						<div className='input-group mb-3'>
							<span className='input-group-text'>GET: </span>
							<input
								type='text'
								className='form-control'
								placeholder='Add product'
								aria-label='AddProduct'
								disabled
								defaultValue='http://tk24h.com/api/auto/add_product?key=<KEY>&id=<ID>&data=<DATA>'
							/>
						</div>
						<div
							className='table-responsive'
							style={{ marginTop: 50 }}
						>
							<table className='table table-striped table-bordered table-hover table-sm'>
								<thead className='thead-light'>
									<tr>
										<th scope='col' style={{ width: 110 }}>
											Tham số
										</th>

										<th scope='col' style={{ width: 100 }}>
											Dữ liệu
										</th>
										<th scope='col'>Ví dụ</th>
										<th scope='col'>Chú thích</th>
									</tr>
								</thead>
								<tbody>
									{columnAPI.map((item, i) => {
										return (
											<tr key={i}>
												<th
													scope='row'
													style={{
														textAlign: 'center',
														verticalAlign: 'middle',
													}}
												>
													{item.variable}
												</th>

												<td>{item.type}</td>

												<td>{item.example}</td>

												<td>{item.note}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default GetAPIAdmin
