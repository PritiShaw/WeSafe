import React, { useState } from 'react';
import Header from '../Layout/header'

const Profile = () => {
  const [inputList, setInputList] = useState([]);
  const [numberList, setNumberList] = useState([])

  const addContactsButton = (e) => {
    setInputList(inputList.concat(<Input idx={numberList.length} required={inputList.length == 0} />))
    setNumberList(numberList.concat(null))
  }

  const storeInput = (inp, idx) => {
    numberList[idx] = inp
    setNumberList(numberList)
  }

  const Input = ({ idx, required = false }) => {
    return (<div className="form-group">
      <label>Member {idx + 1} Details</label>
      <input name={"member" + idx} type="tel" minlength="10" maxlength="10" 
        className="form-control border" placeholder="Enter phone number" 
        onChange={(e) => storeInput(e.target.value, idx)} required={required} />
    </div>);
  }

  return (
    <div className="row">
      <Header title="Emergency Contacts" />
      <div className="col-12 py-2">
        <form>
          {inputList}
          <hr />
          <div className="row px-2">

            <a className="btn btn-primary col mr-1" onClick={addContactsButton}>Add Contact</a>
            {
              inputList.length > 0 ? <button type="submit" className="btn btn-success col ml-1" >Save</button> : null
            }
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile;