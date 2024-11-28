import React, { useState, useEffect} from "react";

import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import {useNavigate} from "react-router-dom";
import {BASE_SERVER_URL} from '../ServerURL'
import SideMenu from "./nav/SideMenu";
import Header from "./styling-components/Header";
import {Button} from "react-bootstrap";

function AddStation(props) {

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);
  const [stateStationId,setStateStationId] = useState("");
  const [stateStationKey,setStateStationKey] = useState("");
  const navigate = useNavigate();

  //const BASE_SERVER_URL = "http://localhost:8000"
  //const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"


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
            if(response.status === 200){
              navigate("/add-station-on-map?stationId="+stateStationId)
            }
            else{
              alert("Podano niepoprawne id stacji lub klucz")
            }            
        })
  }


  return (
      <>
        <div id="navlist">
          <SideMenu/>
        </div>
        <div className="content-padding">
          {stateIsLoggedIn ?
              <div id="add-station">
                <Header headerText="Dodaj nową stację"/>
                <h3>Podaj id stacji i klucz stacji</h3>
                <form onSubmit={handleStationIdCheck}>
                  <label>Id stacji:<p/>
                    <input className="form-control" type="text" value={stateStationId} onChange={handleChangeStationId}/>
                  </label>
                  <p/>
                  <label>Klucz stacji:<p/>
                    <input className="form-control" type="text" value={stateStationKey} onChange={handleChangeStationKey}/>
                  </label>
                  <p/>
                  <input className="btn btn-primary" type="submit" value="Wyślij"/>
                </form>
              </div>
              : <div className="LoginNeeded">
                <Header headerText="Dodaj nową stację"/>
                <h3>Wymagane zalogowanie</h3>
                <Button onClick={switchToLoginPage}>Zaloguj się</Button>
              </div>

          }

        </div>
      </>
  )
}

export default AddStation;