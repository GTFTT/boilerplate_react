//vedor
import 'antd/dist/antd.css'; //Styles for all antd components, if you remove this - antd will not work
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';

//proj
import store, { persistor } from './store/store';
import history from './store/history';
import Routes from './routes/Main';
import { Navigation } from 'UI';

//own
import './App.css';

export default class App extends Component {
    render() {
        return (
            <Provider store={ store }>
                <PersistGate loading={ null } persistor={ persistor }>
					<ConnectedRouter history={ history }>
						<div className="App">
                            <Navigation>
						    	<Routes />
                            </Navigation>
						</div>
					</ConnectedRouter>
                </PersistGate>
            </Provider>
        );
    }
}
