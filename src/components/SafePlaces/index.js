import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import navImage from '../../assets/images/navigation.png';

const SafePlace = ({ emergencyId, setEmergencyId }) => {
    const [safePlaceCord, setSafePlaceCord] = useState(null)
    const [presentGPS, setPresentGPS] = useState(null)

    const liveTrackDevice = async (position) => {
        let tempString = `${position.coords.latitude},${position.coords.longitude}`

        if (!presentGPS)
            setPresentGPS(tempString)
        else if (presentGPS === tempString)
            return

        if (!emergencyId)
            return
        const request_body = {
            "emergency_id": emergencyId,
            "gps": {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
        }
        const result = await fetch('/api/safe_place', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request_body)
        });
        const response = await result.json()
        if (response.status === 200) {
            const { coordinate } = response
            if (coordinate)
                setSafePlaceCord([coordinate["latitude"], coordinate["longitude"]])
        }
    }

    // Onload
    useEffect(() => {
        navigator.geolocation.watchPosition(liveTrackDevice);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const cancelEmergency = async () => {
        await fetch(`/api/emergency?id=${emergencyId}`, {
            method: 'PUT'
        });
        setEmergencyId(null)
    }

    if (!emergencyId)
        return <Redirect to='/' />

    return (
        <div className="row">
            <div className="col-12 text-center pt-5">
                <center>
                    <img src={navImage} alt="Navigate" className="my-3" />
                    <a target="_blank" rel="noreferrer"
                        href={"https://www.google.com/maps/dir/Current+Location/" + (safePlaceCord ? `${safePlaceCord[0]},${safePlaceCord[1]}` : "police")}
                        className="btn btn-success btn-block shadow-lg w-75 bg-success py-2 mt-4 mb-5 px-5"
                    >
                        <span className="h1">Go to {safePlaceCord ? "Safe Place" : "Police Station"}</span>
                    </a>
                    <hr />
                    <div className="row px-5 mt-5">
                        <a className="btn btn-primary col mr-1" href="tel:911">
                            <span className="h3">
                                Call Police
                            </span>
                        </a>
                        <button className="btn btn-danger col ml-1" onClick={cancelEmergency}>
                            <span className="h3">
                                Cancel SOS
                            </span>
                        </button>
                    </div>
                </center>
            </div>
        </div>
    )
}

export default SafePlace;