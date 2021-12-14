import React, { Component } from 'react'
import Index from './components/Index'
// import ShoppingList from './components/ShoppingList';
// import ItemModal from './components/ItemModal';
// import { Container } from 'reactstrap';

import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/authActions'
// import { loadSetting } from './actions/settingActions';

// import 'bootstrap/dist/css/bootstrap.min.css';
import './vendor/fontawesome-free/css/all.min.css'
import './css/fonts-googleapis.css'
// import './css/sb-admin-2.min.css';
import 'reactjs-toastr/lib/toast.css'
import './App.css'

class App extends Component {
	constructor() {
		super()

		store.dispatch(loadUser())
	}

	componentDidMount() {
		// store.dispatch(loadUser());
	}

	render() {
		return (
			<Provider store={store}>
				<Index />
				{/*<Container>
					<ItemModal />
					<ShoppingList />
				</Container>*/}
			</Provider>
		)
	}
}

export default App
