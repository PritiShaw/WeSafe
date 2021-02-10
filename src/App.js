import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Layout from './components/Layout';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/about">
            <h1>About</h1>
          </Route>
          <Route path="/users">
            <h1>Users</h1>
          </Route>
          <Route path="/">
            <Home />
          </Route>
          <Route path="*">
            <h1>Not found</h1>
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}

export default App;