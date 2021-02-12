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
import EmergencyToast from './components/emergencyToast'

const App = () => {
  const [profile, setProfile] = useState(null)
  const [emergencies, setEmergencies] = useState([])


  const handleIncomingEmergency = async (data) => {
    const emergencyId = data["emergency_id"]
    const victimCordinates = data["victim_cord"]

    const distance = (point1, point2) => {
      const R = 6371; // km
      const toRadFactor = Math.PI / 180
      const dLat = toRadFactor * (point2[0] - point1[0]);
      const dLon = toRadFactor * (point2[1] - point1[1]);
      const lat1 = toRadFactor * (point1[0]);
      const lat2 = toRadFactor * (point2[0]);

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d;
    }

    const acceptEmergency = (userCordinates, victimCordinates, emergencyID) => {
      setEmergencies(emergencies.push({
        userCordinates, victimCordinates, emergencyID
      }))
      window.$("#emergency-toast").toast('show')

      // Update nearby device in server
      fetch('/api/accept_emergency', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "gps": userCordinates,
          "emergency_id": emergencyID
        })
      });
    }

    // get user gps
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userGpsCord = [position.coords.latitude, position.coords.longitude]
      const distanceToEmergency = distance(userGpsCord, victimCordinates)
      if (distanceToEmergency < 1) // 1Km
        acceptEmergency(userGpsCord, victimCordinates, emergencyId)

    }, (error) => {
      console.warn("Could not fetch device location", error.message)
    });
  }


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

  }, [])    // eslint-disable-line react-hooks/exhaustive-deps



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
        {
          emergencies.length > 0 ? <EmergencyToast
            distance={emergencies[emergencies.length - 1].distance}
            tracking_id={emergencies[emergencies.length - 1].tracking_id}
          /> : null
        }
      </Layout>
    </Router>
  )
}

export default App;