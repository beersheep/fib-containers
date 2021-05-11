import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Home</Link>
          <Link to="other_page">Other Page</Link>
        </header>
        <div>
          <Route exact path="/" component={Fib} />
          { /* for nginx routing */ }
          <Route exact path="/other_page" component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
