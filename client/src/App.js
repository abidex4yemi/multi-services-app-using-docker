import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';

const App = () => {
  return (
    <>
      <Router>
        <div>
          <Link to="/">Home</Link>
          <Link to="/other-page">OtherPage</Link>
        </div>
        <Route exact path="/" component={Fib} />
        <Route exact path="/other-page" component={OtherPage} />
      </Router>
    </>
  );
};

export default App;
