import React from 'react'
import { useSelector } from 'react-redux'

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
					<div className='api_tutorial'>Hướng dẫn sử dụng:</div>
				</div>
			</div>
		</div>
	)
}

export default GetAPI
