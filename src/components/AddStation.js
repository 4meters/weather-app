import React, { useState, useEffect} from "react";

import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import {useNavigate} from "react-router-dom";
import SideMenu from "./nav/SideMenu";
import Header from "./styling-components/Header";
import {Button} from "react-bootstrap";

import * as addStationApi from '../API/AddStationAPI'

function AddStation(props) {

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);
  const [stateStationId,setStateStationId] = useState("");
  const [stateStationKey,setStateStationKey] = useState("");
  const navigate = useNavigate();


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

  const handleStationIdCheck = (e) => {
    e.preventDefault();
    console.log(stateStationId)
    addStationApi.stationIdCheckRequest(stateStationId, stateStationKey, stateToken, (res)=>{
      if(res.status === 200){
        navigate(`/add-station-on-map?stationId=${stateStationId}&stationKey=${stateStationKey}`)
      }
      else{
        alert("Podano niepoprawne id stacji lub klucz, lub stacja jest już dodana na mapę")
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