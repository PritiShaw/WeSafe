import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';

const Home = ({ setProfile }) => {
    const googleClientID = process.env.REACT_APP_GOOGLE_CLIENT_ID

    const responseGoogleSuccess = (response) => {
        setMessage("")
        const { profileObj } = response
        setProfile(profileObj)
    }
    const responseGoogleFail = (response) => {
        const { error } = response
        setMessage(error)
        setProfile(null)
    }

    const [message, setMessage] = useState("")

    return (
        <div className="row">
            <div className="col-12 text-center mt-5 pt-5">
                <h1 className="mt-5 pt-5">Welcome!</h1>
                <center>
                    <GoogleLogin
                        clientId={googleClientID}
                        buttonText="Login with Google"
                        onSuccess={responseGoogleSuccess}
                        onFailure={responseGoogleFail}
                        isSignedIn={true}
                        theme="dark"
                        className="mt-5"
                    />
                    <p className="lead mt-5 pt-5">{message}</p>
                </center>
            </div>
        </div>
    )
}

export default Home;