import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import {
	laylichsunapadmin,
	getTotalMoney,
	laytongdoanhthu,
} from '../../../actions/itemActions'

import { Line } from 'react-chartjs-2'

// const myNewTheme= {
//     headCells: {
//       style: {
//         fontWeight: 'bold',
//           fontSize: '14px',
//       },
//   }
// }
class AdminLichSuNapTien extends Component {
	componentDidMount() {
		this.props.laytongdoanhthu()
	}
	render() {
		const { admintongdoanhthu } = this.props.item
		var new_labels = []
		var new_datasets = []
		var new_labelsv2 = []
		var new_datasetsv2 = []
		var groupArrays = []
		var groupArraysv2 = []
		var groups = []
		var groupsv2 = []

		if (admintongdoanhthu.length > 0) {
			groups = admintongdoanhthu[0].lichsunaptien.reduce(
				(groups, game) => {
					const date = game.thoigian_nap.split('T')[0].slice(0, 7)
					if (!groups[date]) {
						groups[date] = 0
					}
					groups[date] = groups[date] + game.tien_nap
					return groups
				},
				{}
			)

			groupArrays = Object.keys(groups).map((date) => {
				new_labels.unshift(date)
				// new_datasets.unshift(groups[date]);
				// return {
				// date,
				// lichsunaptien: groups[date]
				// };
			})
			// console.log(groupArrays);

			groupsv2 = admintongdoanhthu[0].lichsumua.reduce(
				(groupsv2, game) => {
					const datev2 = game.ngaymua.split('T')[0].slice(0, 7)
					if (!groupsv2[datev2]) {
						groupsv2[datev2] = 0
					}
					groupsv2[datev2] = groupsv2[datev2] + game.price_buy
					return groupsv2
				},
				{}
			)

			groupArraysv2 = Object.keys(groupsv2).map((datev2) => {
				new_labelsv2.unshift(datev2)
				// new_datasetsv2.unshift(groupsv2[datev2]);
				// return {
				// datev2,
				// lichsumua: groupsv2[datev2]
				// };
			})
		}
		var new_labelsv3 = []
		// if (new_labels.length > 0 && new_labelsv2.length > 0) {
		var new_labelstmp = new_labels.concat(new_labelsv2)
		new_labelstmp.map((v) => {
			if (new_labelsv3.indexOf(v) === -1) {
				new_labelsv3.push(v)
			}
		})
		// }

		if (groups != null) {
			for (var i = 0; i < new_labelsv3.length; i++) {
				// console.log(groups);
				// console.log(groups[new_labelsv3[i]]);
				if (typeof groups[new_labelsv3[i]] === 'undefined') {
					new_datasets.push(0)
				} else {
					new_datasets.push(groups[new_labelsv3[i]])
				}
			}
		}
		// console.log(new_datasets);

		if (groupsv2 != null) {
			for (var i = 0; i < new_labelsv3.length; i++) {
				// console.log(groupsv2);
				// console.log(groupsv2[new_labelsv3[i]]);
				if (typeof groupsv2[new_labelsv3[i]] === 'undefined') {
					new_datasetsv2.push(0)
				} else {
					new_datasetsv2.push(groupsv2[new_labelsv3[i]])
				}
			}
		}
		// console.log(new_datasetsv2);

		const data = {
			labels: new_labelsv3,
			datasets: [
				{
					label: 'Tổng tiền nạp (VNĐ)',
					data: new_datasets,
					fill: false,
					backgroundColor: 'rgb(50 108 167)',
					borderColor: 'rgb(50 108 167)',
				},
				{
					label: 'Tổng tiền mua (VNĐ)',
					data: new_datasetsv2,
					fill: false,
					backgroundColor: 'rgb(167 50 50)',
					borderColor: 'rgb(167 50 50)',
				},
			],
		}
		const options = {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
							callback(value) {
								return Number(value).toLocaleString('en')
							},
						},
					},
				],
				xAxes: [
					{
						ticks: {
							autoSkip: true,
							maxRotation: 75,
							minRotation: 0,
						},
					},
				],
			},
			tooltips: {
				mode: 'index',
				intersect: false,
				callbacks: {
					label: function (tooltipItem, data) {
						return Number(tooltipItem.yLabel).toLocaleString('en')
					},
				},
			},
			hover: {
				mode: 'nearest',
				intersect: true,
			},
		}
		return (
			<Fragment>
				<div className='content'>
					<div className='block block-rounded block-bordered'>
						<div className='block-header block-header-default border-bottom'>
							<h3 className='block-title'>
								Tổng doanh thu hàng tháng
							</h3>
						</div>
						<div className='block-content'>
							<Line data={data} options={options} />
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	error: state.error,
	auth: state.auth,
	item: state.item,
})

export default connect(mapStateToProps, {
	laylichsunapadmin,
	getTotalMoney,
	laytongdoanhthu,
})(AdminLichSuNapTien)
