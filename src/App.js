//vedor
import 'antd/dist/antd.css'; //Styles for all antd components, if you remove this - antd will not work

//proj
import DuckGeteratorPage from './DuckGeneratorPage';
import logo from './logo.svg';

//own
import './App.css';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<div className="title">
					Boilerplate reducer
				</div>
			</header>

			<div>
				<DuckGeteratorPage />
			</div>
		</div>
	);
}

export default App;
