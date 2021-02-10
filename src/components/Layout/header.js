import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({title}) => {
    return (
        <nav className="navbar navbar-dark bg-secondary w-100">
            <Link className="navbar-brand" to="/">{title || "WeSafe"}</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarToggle">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header;