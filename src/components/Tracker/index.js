import React from 'react';
import Header from '../Layout/header';
import markerImg from './track.png';

const imageStyle = {
    height: "90px"
}

const Tracker = () => {
    return (
        <div className="row">
            <Header />
            <center className="col-12"><p className="display-4 mt-5">Tracker</p></center>
            <div className="col-12 text-center mt-2 pt-2">
                <center>
                    <img src={markerImg} style={imageStyle} />
                    <button className=" shadow-lg btn btn-primary btn-block w-75 my-5 bg-primary ">
                        <h3>Track</h3>
                    </button>
                </center>
            </div>
        </div>
    )
}

export default Tracker;