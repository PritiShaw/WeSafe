import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../Layout/header';

import markerImg from '../../assets/images/marker.png';

const timeSince = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " yrs";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hr";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " min";
    }
    return Math.floor(seconds) + " s";
}

const NearbyEmergency = ({ emergencies }) => {
    return (
        <div className="row">
            <Header title="Nearby Emergencies"/>            
            <div className="col-12 mt-5 pt-3 px-0">
                <table className="table table-striped w-100">
                    <thead>
                        <tr>
                            <th>Direction</th>
                            <th>When</th>
                            <th>How Far</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (emergencies && emergencies.length > 0) ? emergencies.map((emergency) => (
                                <tr>
                                    <td><Link to={`/track/${emergency.tracking_id}`}><img src={markerImg} alt="Direction" /></Link></td>
                                    <td>{timeSince(emergency.timestamp)} ago</td>
                                    <td>{emergency.distance<1?Math.round(emergency.distance*1000):`${Math.round(emergency.distance*100)/100}k`}m</td>
                                </tr>
                                )
                            ):<tr><td colSpan="3" className="text-center">No Emergency</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default NearbyEmergency;