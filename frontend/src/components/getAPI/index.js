import React from 'react'
import { useSelector } from 'react-redux'
import columnAPI from './columnAPI'

function GetAPI(props) {
	const user = useSelector((state) => state.auth.user)

	return (
		<div className='content'>
			<div className='block block-rounded block-bordered'>
				<div className='block-header block-header-default border-bottom'>
					<h3 className='block-title'>API</h3>
				</div>
				<div className='block-content'>
					<div className='input-group mb-3'>
						<span className='input-group-text'>Secret key: </span>
						<input
							type='text'
							className='form-control'
							placeholder='Secret key'
							aria-label='SecretKey'
							defaultValue={user.key ? user.key : ''}
						/>
					</div>
					<div className='api_tutorial'>
						<h5>Hướng dẫn sử dụng: </h5>
						<div className='input-group mb-3'>
							<span className='input-group-text'>Url API: </span>
							<input
								type='text'
								className='form-control'
								placeholder='Secret key'
								aria-label='SecretKey'
								disabled
								defaultValue='http://tk24h.com/api/auto/buy_product?key=<KEY>&id=<ID>&sl=<NUMBER>'
							/>
							<div
								className='table-responsive'
								style={{ marginTop: 20 }}
							>
								<table className='table table-striped table-bordered table-hover table-sm'>
									<thead className='thead-light'>
										<tr>
											<th
												scope='col'
												style={{ width: 110 }}
											>
												Tham số
											</th>

											<th
												scope='col'
												style={{ width: 100 }}
											>
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
															verticalAlign:
																'middle',
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
		</div>
	)
}

export default GetAPI
