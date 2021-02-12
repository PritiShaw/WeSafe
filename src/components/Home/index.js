import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import Header from '../Layout/header';

import './style.css'

const SOS = ({ emergencyId, setEmergencyId, profile }) => {

    const initiateEmergency = async () => {
        const { googleId } = profile
        // get user gps
        navigator.geolocation.getCurrentPosition(async (position) => {
            const request_body = {
                "userid": googleId,
                "gps": {
                    "latitude" : position.coords.latitude,
                    "longitude" : position.coords.longitude
                }
            }
            const result = await fetch('/api/emergency', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request_body)
            });
            const response = await result.json()
            setEmergencyId(response.id)

        }, (error) => {
            alert("Could not fetch device location, Try Again ", error.message)
        });

    }

    if (emergencyId)
        return <Redirect to='/safeplace' />

    return (
        <div className="row">
            <Header />
            <div className="col-12 text-center mt-5 pt-5">
                <center>
                    <button className="btn btn-primary btn-block border shadow-lg w-75 my-5 sos"
                        aria-label="Emergency" onClick={initiateEmergency}>
                        <span className="display-1 font-weight-bold">SOS</span>
                    </button>
                    <hr />
                    <Link to="/nearby" className="btn btn-success mt-5 text-center btn-lg btn-block mb-5">
                        <span className="lead text-light font-weight-normal">Nearby Emergencies</span>
                    </Link>
                </center>
            </div>
        </div>
    )
}

export default SOS;