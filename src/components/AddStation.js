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
  //const BASE_SERVER_URL = "http://localhost:8000"
  const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"

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
  }, [])


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

    fetch(BASE_SERVER_URL+`/api/station/verify-station`, requestParams)
        .then(response => {
            if(response.status==200){
              navigate("/add-station-on-map?stationId="+stateStationId)
            }            
        })
  }



  return (
    <>   
<div id="navlist">
  <NavList/>
</div>

      <div>
      {stateIsLoggedIn ?
        <div className="Add-station">
          <h1>Dodaj nową stację</h1>
          <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
          <h3>Podaj id stacji i klucz stacji</h3>
          <form onSubmit={handleStationIdCheck}>
            <label>Id stacji:<p/>
              <input type="text" value={stateStationId} onChange={handleChangeStationId} />
            </label>
            <p/>
            <label>Klucz stacji:<p/>
              <input type="text" value={stateStationKey} onChange={handleChangeStationKey} />
            </label>
            <p/>
            <input type="submit" value="Wyślij" />
          </form>
        </div>
        : <div className="LoginNeeded">
          <h1>Dodaj nową stację</h1>
          <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
          <h3>Wymagane zalogowanie</h3>
          <button onClick={switchToLoginPage}>Zaloguj się</button>
          </div>

      }
      
      </div>
    </>
  )
}

export default AddStation;