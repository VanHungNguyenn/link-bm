const columnAPI = [
	{
		variable: 'KEY',
		type: 'string',
		example: '$2b$12$JY40XTw1jkcHgpoL0eC...',
		note: 'Secret key riêng của mỗi account',
	},
	{
		variable: 'ID',
		type: 'string',
		example: '1',
		note: 'Id của sản phẩm tương ứng trên bảng danh sách',
	},
	{
		variable: 'NUMBER',
		type: 'string',
		example: '10',
		note: 'Số lượng account muốn mua',
	},
	{
		variable: 'DATA',
		type: 'string',
		example: 'Test|Test|2FA',
		note: 'Thông tin account cần thêm',
	},
]

export default columnAPI
