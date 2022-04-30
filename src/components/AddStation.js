import React, { useState, useEffect} from "react";

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import {useNavigate} from "react-router-dom";
import {withRouter} from '../withRouter'
//import 'SideNavigation.js'


function AddStation(props) {

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);
  const [stateStationId,setStateStationId] = useState("");
  const [stateStationKey,setStateStationKey] = useState("");
  const navigate = useNavigate();

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }


  useEffect(() =>{
    console.log("Logged in:"+stateIsLoggedIn)
    let token=localStorage.getItem('token');
    if(typeof(token)==="string"){
      if(token.length>0){
        setStateToken(localStorage.getItem('token'));
        setStateIsLoggedIn(true);
      }
      else{
        setStateIsLoggedIn(false);
      }
    }
    else{
      setStateIsLoggedIn(false);
      }
  }, []) //only on first run, if not it breaks some things with no errors in console


  const switchToLoginPage = () =>{  
    navigate("/login");
  }

  const handleChangeStationId = (event) => {
    setStateStationId(event.target.value);
  }

  const handleChangeStationKey = (event) => {
    setStateStationKey(event.target.value);
  }

  const handleStationIdCheck = (event) => {
    event.preventDefault();
    console.log(stateStationId)
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "stationId" : stateStationId,
        "stationKey" : stateStationKey,
        "token": stateToken
    })
    };

    fetch(`http://127.0.0.1:8080/api/station/verify-station`, requestParams)
        .then(response => {
            if(response.status==200){
              navigate("/add-station-on-map?stationId="+stateStationId)
            }            
        })
  }


  const handleClickLogout = () =>{
    setStateIsLoggedIn(false);
    setStateToken("");
    localStorage.setItem('token',"");
  }


  return (
    <>   
<div className="d-flex p-2 col-example">
  <NavList/>
</div>

      <div className="d-flex p-2 col-example">
      {stateIsLoggedIn ?
        <div className="Add-station">
          <h1>Add new station</h1>
          <h3>Enter your station id and key number</h3>
          <form onSubmit={handleStationIdCheck}>
            <label>Station id:<p/>
              <input type="text" value={stateStationId} onChange={handleChangeStationId} />
            </label>
            <p/>
            <label>Station key:<p/>
              <input type="text" value={stateStationKey} onChange={handleChangeStationKey} />
            </label>
            <p/>
            <input type="submit" value="Send" />
          </form>
        </div>
        : <div className="LoginNeeded">
          <h1>Login required</h1>
          <button onClick={switchToLoginPage}>Login</button>
          </div>

      }
      
      </div>
    </>
  )
}

export default AddStation;