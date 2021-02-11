import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Pusher from 'pusher-js';


import Layout from './components/Layout';
import Home from './components/Home';
import Profile from './components/Profile';
import SOS from './components/SOS';
import Nearby from './components/NearbyEmergency';
import SafePlace from './components/SafePlaces';
import Track from './components/Tracker';

const App = () => {
  const [profile, setProfile] = useState(null)

  // Onload
  useEffect(() => {
    const channelName = process.env.REACT_APP_PUSHER_CHANNEL || "wesafe"
    const pusherKey = process.env.REACT_APP_PUSHER_KEY
    const pusherCluster = process.env.REACT_APP_PUSHER_CLUSTER
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster
    });
    const channel = pusher.subscribe(channelName);
    const eventName = "emergency"
    
    channel.bind(eventName, data => {
      handleIncomingEmergency(data)
    });

    return () => channel.unbind(eventName);

  }, [])

  const handleIncomingEmergency = async (data) => {
    console.log(data) // TODO
  }

  return (
    <Router>
      <Layout>
        {profile ? <Switch>
          <Route path="/profile" exact>
            <Profile profile={profile} />
          </Route>
          <Route path="/nearby" exact component={Nearby} />
          <Route path="/safeplaces" exact component={SafePlace} />
          <Route path="/track" exact component={Track} />
          <Route path="/" exact component={SOS} />
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