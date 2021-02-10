import React from 'react';
import { Link } from 'react-router-dom';

import "./style.css"
import logoImg from "../../assets/images/logo.png"

const Layout = ({ children }) => {
  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-sm-6 pt-5">
          <center className="mt-5 pt-5">
            <img src={logoImg} alt="WeSafe"/>
            <hr />
            <p className="lead">Priti Shaw</p>
          </center>
        </div>
        <div className="col-sm-4  col-12 mobile">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout;