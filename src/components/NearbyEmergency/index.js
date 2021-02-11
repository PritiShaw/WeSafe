import React from 'react';
import Header from '../Layout/header';

import markerImg from './marker.png';

const NearbyEmergency = () => {
    return (
        <div className="row">
            <Header />
            <center className="col-12"><h3 className="mt-2">Emergencies</h3></center>
            <div className="col-12 text-center mt-2 pt-2">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Direction</th>
                            <th>When</th>
                            <th>How Far</th>
                        </tr>
                    </thead>
                    <tbody>                        
                        <tr>
                            <td><a href="/" target="_blank"><img src={markerImg} alt="Direction"/></a></td>
                            <td>5 mins ago</td>
                            <td>200m</td>
                        </tr>                        
                        <tr>
                            <td><a href="/" target="_blank"><img src={markerImg} alt="Direction"/></a></td>
                            <td>5 mins ago</td>
                            <td>200m</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default NearbyEmergency;