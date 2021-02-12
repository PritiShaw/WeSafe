import React from 'react';


const EmergencyToast = ({distance, tracking_id}) => (
    <div className="toast position-absolute w-100 border shadow" id="emergency-toast" data-delay="5000">
        <div className="toast-header bg-warning text-light">
            <strong className="mr-auto">Emergency Nearby</strong>
            <button type="button" className="ml-2 mb-1 close"  onClick={(e)=>window.$(e.target.dataset.dismiss).toast('dispose')}>
                <span aria-hidden="true" data-dismiss="#emergency-toast">×</span>
            </button>
        </div>
        <div className="toast-body">
            {Math.round(distance*1000)} meters away, tap to navigate
        </div>    
    </div>

)


export default EmergencyToast