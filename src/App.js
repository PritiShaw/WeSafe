import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Layout from './components/Layout';
import Home from './components/Home';
import Profile from './components/Profile'
import SOS from "./components/SOS";

const App = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/sos" exact component={SOS}/> 
          <Route path="/profile" exact component={Profile}/>
          <Route path="/" exact component={Home}/>
          
          <Route path="*">
            <h1>Not found</h1>
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}

export default App;