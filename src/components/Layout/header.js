import React from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';


const Header = ({ title }) => {
    const googleClientID = process.env.REACT_APP_GOOGLE_CLIENT_ID

    const logOutFunctionSuccess = () => {
        console.log("loggedout")
    }
    const logOutFunctionFail = () => {
        alert("Failed to Logout, try again")
    }
    return (
        <nav className="navbar navbar-dark bg-secondary w-100">
            <Link className="navbar-brand" to="/">{title || "WeSafe"}</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarToggle">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/profile">Profile</Link>
                    </li>
                    <li className="nav-item">
                        <GoogleLogout
                            clientId={googleClientID}
                            buttonText="Logout"
                            render={(e) => <a onClick={e.onClick} href="/" className="nav-link">Logout</a>}
                            onLogoutSuccess={logOutFunctionSuccess}
                            onFailure={logOutFunctionFail}
                        />
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header;