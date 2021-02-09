import React from 'react';
import Layout from './components/Layout';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

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
            <h1>Home</h1>
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