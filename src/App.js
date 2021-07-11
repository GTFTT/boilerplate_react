import logo from './logo.svg';

//proj
import DuckGeteratorPage from './DuckGeneratorPage';

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
