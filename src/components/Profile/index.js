import React, { useState, useEffect } from 'react';
import Header from '../Layout/header'

const Profile = ({ profile }) => {
  const [numberList, setNumberList] = useState([])
  const [message, setMessage] = useState("")

  // Onload
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { googleId } = profile
        const result = await fetch(`api/profile?id=${googleId}`)
        const body = await result.json()
        if (body.status === 200) {
          const contacts = body.data["emergency_contacts"]
          console.log(contacts)
          const total_contacts = contacts.length
          if (total_contacts === 0)
            setMessage("Kindly fill your profile")
          else
            setNumberList(contacts)
        }
        else if (body.status === 404)
          setMessage("Kindly fill your profile")
        else
          setMessage("Internal Error, try again later")
      } catch (err) {
        console.log(err)
        setMessage("Internal Error, try again later")
      }
    }

    fetchData()
  }, [profile])


  const addContactsButton = (e) => {
    setNumberList(numberList.concat(null))
  }

  const storeInput = (inp, idx) => {
    numberList[idx] = inp
    setNumberList(numberList)
  }

  const MemberInput = ({ idx, required = false, value = "" }) => {
    return (<div className="form-group">
      <label>Member {idx + 1} Details</label>
      <input name={"member" + idx} type="search" minLength="10" maxLength="10"
        className="form-control border" placeholder="Enter phone number"
        onChange={(e) => storeInput(e.target.value, idx)} defaultValue={value} required={required} />
    </div>);
  }


  const profileFormSubmit = async (e) => {
    e.preventDefault()

    const { googleId } = profile
    const request_body = {
      "id": googleId,
      "numbers": numberList
    }
    const result = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_body)
    });
    const body = await result.json();
    if (body["status"] === 200)
      if (body["modified"] === 0)
        setMessage("Nothing to change")
      else
        setMessage("Profile Updated")
    else {
      setMessage(body["message"])
    }
  }

  return (
    <div className="row">
      <Header title="Emergency Contacts" />
      <div className="col-12 mt-5 py-3">
        <form onSubmit={profileFormSubmit}>
          {
            numberList.map((number, idx) => <MemberInput key={idx} value={number} idx={idx} required={idx === 0} />)
          }
          <hr />
          <div className="row px-2">
            <button type="button" className="btn btn-primary col mr-1" onClick={addContactsButton}>
              Add Contact
            </button>
            {
              numberList.length > 0 ? <button type="submit" className="btn btn-success col ml-1" >Save</button> : null
            }
          </div>
        </form>
        <p className="lead text-center mt-2">{message}</p>
      </div>
    </div>
  )
}

export default Profile;