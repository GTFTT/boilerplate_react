//vedor
import 'antd/dist/antd.css'; //Styles for all antd components, if you remove this - antd will not work
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';

//proj
import logo from './logo.svg';
import store, { persistor } from './store/store';
import history from './store/history';
import Routes from './routes/Main';

//own
import './App.css';

export default class App extends Component {
    render() {
        return (
            <Provider store={ store }>
                <PersistGate loading={ null } persistor={ persistor }>
					<ConnectedRouter history={ history }>
						<div className="App">
							<header className="App-header">
								<img src={logo} className="App-logo" alt="logo" />
								<div className="title">
									Boilerplate reducer
								</div>
							</header>

							<Routes />
						</div>
					</ConnectedRouter>
                </PersistGate>
            </Provider>
        );
    }
}
