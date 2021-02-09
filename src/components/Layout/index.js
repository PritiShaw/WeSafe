import React from 'react';

import "./style.css"
import bgImg from "./background.png"

const Layout =({children}) =>{
    return(
      <div className="container-fluid h-100">        
        <div className="row h-100">
          <div className="col-sm-6 pt-5">
            <center className="mt-5 pt-5">
              <h1 className="mt-5 pt-5">WeSafe</h1>
              <hr/>
              <p>Priti Shaw</p>
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