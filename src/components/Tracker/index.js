import React, { useState, useEffect } from 'react';
import Header from '../Layout/header';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import "./style.css"

const Map = ({ path }) => {

    let center = [0, 0]
    if (path.length > 0) {
        center = path[path.length - 1]
    }

    return <MapContainer className="h-100" center={center} zoom={15} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {
            path.map((point, idx) => <Marker key={idx} position={point}>
                <Popup>
                    Point {idx+1}<br/>
                    <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/Current+Location/${point[0]},${point[1]}`}>
                        Navigate
                    </a>
                </Popup>
            </Marker>)
        }
    </MapContainer>

}

const Tracker = (props) => {
    const [path, setPath] = useState([])
    useEffect(() => {
        const trackingID = props.match.params.trackingID
        const fetchData = async () => {
            const result = await fetch(`/api/emergency?id=${trackingID}`);
            const response = await result.json()
            if (response.status === 200) {
                setPath(response.data["gps_history"])
            }
        }
        const periodicCall = setInterval(fetchData, 10000) // every 10s
        return () => clearInterval(periodicCall);
    }, [props])

    return (
        <div className="row h-100">
            <Header title="Live Track" />
            <div className="col-12 text-center px-0 h-100 pt-5">
                {
                    path.length > 0 ? <Map path={path} /> : <p className="text-center lead loading mt-5">Loading...</p>
                }
            </div>
        </div >
    )
}

export default Tracker;