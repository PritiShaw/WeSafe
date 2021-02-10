import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Layout from './components/Layout';
import Home from './components/Home';
import Profile from './components/Profile'

const App = () => {
  const [profile, setProfile] = useState(null)
  return (
    <Router>
      <Layout>
        {profile ? <Switch>
          <Route path="/profile" exact component={Profile} />
          {/* <Route path="/" exact component={Home}/> */}
          <Route path="*">
            <h1>Not found</h1>
          </Route>
        </Switch> : <Home setProfile={setProfile} />
        }
      </Layout>
    </Router>
  )
}

export default App;