import React from 'react';
import Header from '../Layout/header';
import markerImg from '../NearbyEmergency/marker.png';

const imageStyle = {
    height: "50px"
}

const SafePlace = () => {
    return (
        <div className="row">
            <Header />
            <center className="col-12"><p className="display-4 mt-5">Safe Places</p></center>
            <div className="col-12 text-center mt-2 pt-2">
                <center>
                    <img src={markerImg} style={imageStyle} />
                    <button className=" shadow-lg btn btn-success btn-block w-75 my-3 bg-success ">
                        <h3>Navigate to Safe Place</h3>
                    </button>
                    <br />
                    <hr/>
                    <div className="row px-5 mt-5">
                        <a className="btn btn-primary col mr-1">Call Police</a>
                        <button type="submit" className="btn btn-danger col ml-1" >Cancel SOS</button>
                    </div>
                </center>
            </div>
        </div>
    )
}

export default SafePlace;