import React from 'react';
import Header from '../Layout/header';

const divStyle = {
    borderRadius: '25em',
    height: '15em'
    
};
const SOS = () => {
    return (
        <div className="row">
            <Header />
            <div className="col-12 text-center mt-5 pt-5">
                <center>
                    <button className=" shadow-lg btn btn-primary btn-block w-75 my-5 bg-danger " style={divStyle}>
                        <h1>SOS</h1>
                    </button>
                    <hr/>
                    <button className="btn btn-success mt-5 w-100 text-center btn-lg btn-block mb-5">
                        <h6>Nearby Emergency</h6>
                    </button>
                </center>
            </div>
        </div>
    )
}

export default SOS;