import React, { useState, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Pusher from 'pusher-js';


const Layout = React.lazy(() => import('./components/Layout'));
const Login = React.lazy(() => import('./components/Login'));
const Profile = React.lazy(() => import('./components/Profile'));
const Home = React.lazy(() => import('./components/Home'));
const SafePlace = React.lazy(() => import('./components/SafePlaces'));
const Track = React.lazy(() => import('./components/Tracker'));
const EmergencyToast = React.lazy(() => import('./components/Toast/emergency'));
const NearbyEmergency = React.lazy(() => import('./components/NearbyEmergency'));

const App = () => {
  const [profile, setProfile] = useState(null)
  const [emergencies, setEmergencies] = useState([])
  const [emergencyID, setEmergencyID] = useState(null) // Victim device state


  const handleIncomingEmergency = async (data) => {
    const newEmergencyId = data["emergency_id"]
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

    const acceptEmergency = async (userCordinates, victimCordinates, emergencyID, distance) => {

      // Update nearby device in server
      const response = await fetch('/api/active_emergency', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "gps": {
            "latitude": userCordinates[0],
            "longitude": userCordinates[1]
          },
          "emergency_id": emergencyID
        })
      });
      const { tracking_id } = await response.json()
      const timestamp = new Date()
      emergencies.push({
        timestamp, userCordinates, victimCordinates, emergencyID, distance, tracking_id
      })
      console.log(emergencies)
      setEmergencies(emergencies)
      window.$("#emergency-toast").toast('show')
    }

    // get user gps
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userGpsCord = [position.coords.latitude, position.coords.longitude]
      const distanceToEmergency = distance(userGpsCord, victimCordinates)
      console.log(distanceToEmergency)
      if (distanceToEmergency > 0 && distanceToEmergency < 5) // 5Km
        acceptEmergency(userGpsCord, victimCordinates, newEmergencyId, distanceToEmergency)

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
    <Suspense fallback={<p className="lead w-100 mt-5 pt-5 text-center">Loading...</p>}>
      <Router>
        <Layout>
          {profile ? <Switch>
            <Route path="/profile" exact>
              <Profile profile={profile} />
            </Route>
            <Route path="/nearby" exact >
              <NearbyEmergency emergencies={emergencies} />
            </Route>
            <Route path="/track/:trackingID" exact component={Track} />
            <Route path="/safeplace" exact>
              <SafePlace emergencyId={emergencyID} setEmergencyId={setEmergencyID} />
            </Route>
            <Route path="/" exact>
              <Home emergencyId={emergencyID} setEmergencyId={setEmergencyID} profile={profile} />
            </Route>
            <Route path="*">
              <h1>Not found</h1>
            </Route>
          </Switch> : <Login setProfile={setProfile} />
          }
          {
            emergencies.length > 0 ? <EmergencyToast
              distance={emergencies[emergencies.length - 1].distance}
              tracking_id={emergencies[emergencies.length - 1].tracking_id}
            /> : null
          }
        </Layout>
      </Router>
    </Suspense>
  )
}

export default App;