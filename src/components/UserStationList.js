import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Flex from '@react-css/flex'
import {AiFillEdit} from "react-icons/ai";

import EdiText from 'react-editext';
 

//import 'SideNavigation.js'

//https://codereview.stackexchange.com/questions/235854/react-setstate-function-in-useeffect

function UserStationList(props) {


  const [stateFirstRun,setStateFirstRun] = useState(true);
  const [stateLogin,setStateLogin] = useState("");
  const [statePassword,setStatePassword] = useState("");
  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);
  const [stateMyStationList,setStateMyStationList] = useState([]);
  const [stateBookmarkStationList,setStateBookmarkStationList] = useState([]);


  const navigate = useNavigate();


  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const validateLoginData = () => {

    if(stateLogin>0 && statePassword>0){
      return true;
    }
    else{
      return false;
    }

  }

  useEffect(() =>{
    console.log("Logged in:"+stateIsLoggedIn)
    console.log(stateToken);
    let token=localStorage.getItem('token');
    if(typeof(token)==="string"){
      if(token.length>0){
        setStateToken(localStorage.getItem('token'));
        setStateIsLoggedIn(true);
        getUserStationList();
      }
      else{
        setStateIsLoggedIn(false);
      }
    }
    else{
      setStateIsLoggedIn(false);
      }
  }, []) //only on first run, if not it breaks some things with no errors in console

  useEffect(()=>{
    if(stateIsLoggedIn==true){
      getUserStationList();
    }
    
  },[stateToken])

  const handleChangeLogin = event => {
    setStateLogin(event.target.value);
  }

  const handleChangePassword = event => {
    setStatePassword(event.target.value);
  }

  const getUserStationList = event => {
    //TODO add status check
    //TODO empty list catch
    //fetch(`http://127.0.0.1:8080/api/user/get-user-stationlist/`+stateToken)
    fetch(`http://127.0.0.1:8080/api/user/get-user-stationlist/`+stateToken)
        .then(res => res.json())
        .then(response => {
            setStateMyStationList(response['myStationList'])
            setStateBookmarkStationList(response['bookmarkStationList'])
            //console.log(response)
        })
  }


  const handleClickLogout = () =>{
    setStateIsLoggedIn(false);
    setStateToken("");
    localStorage.setItem('token',"");
  }


  const handleClickLogin = () =>{
    navigate("/login")
  }

  const handleStationModeButton=(event) =>{
    switchStationModeRequest(event.target.value)
  }

  const handleChangeMeasureInterval = (measureInterval, stationId) =>{
    console.log(measureInterval, stationId)
    setMeasureIntervalRequest(measureInterval, stationId)
  }

  const handleChangeVisibility = (visibility, stationId) =>{
    console.log(visibility, stationId)
    if(visibility==="true"){
      setVisibilityRequest(true, stationId)
    }
    else{
      setVisibilityRequest(false, stationId)
    }
  }

  const switchStationModeRequest=(data)=>{
    data=JSON.parse(data)
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "stationId" : data['stationId'],
        "mode": data['mode']
    })
    };
    fetch(`http://127.0.0.1:8080/api/station/mode-switch`,requestParams)
    .then(response => {
      if(response.status===200){
        getUserStationList();
      }
    })

  }

  const setMeasureIntervalRequest=(measureInterval, stationId)=>{
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "stationId" : stationId,
        "measureInterval": measureInterval
    })
    };
    fetch(`http://127.0.0.1:8080/api/station/set-measure-interval`,requestParams)
    .then(response => {
      if(response.status===200){
        getUserStationList();
      }
    })

  }

  const setVisibilityRequest=(visibility, stationId)=>{
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "stationId" : stationId,
        "visibility": visibility
    })
    };
    fetch(`http://127.0.0.1:8080/api/station/set-visibility`,requestParams)
    .then(response => {
      if(response.status===200){
        getUserStationList();
      }
    })

  }

  const handleSaveStationName = (newStationName, data) =>{
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "stationId" : data['stationId'],
        "newStationName": newStationName
    })
    };
    fetch(`http://127.0.0.1:8080/api/station/change-station-name`,requestParams)
    .then(response => {
      if(response.status===200){
        getUserStationList();
      }
    })
  }

  //const renderStationItem = (data,idx) =>

  //const renderBookmarkStationItem = (data,idx) =>

  const renderMyStationItemList = (stationlist) =>{
    return (stationlist.map((data,idx)=>{//TODO add idx id div
      console.log(data)
      return (<div key={idx} style={{
        backgroundColor: '#DDDDDD'
      }}>
        <div style={{
      backgroundColor: "#cccc",
      maxWidth: "400px"
        }}>
          <h3><EdiText value={data['stationName']} onSave={(value)=>handleSaveStationName(value, data)}/></h3>
          </div>
        
      <p>{data['stationId']}</p>
      {data['visible']?<p id="visibility">Publiczna</p> :
      <p id="visibility">Prywatna</p> }
  
      <button>Pokaż na mapie</button>
      {
        data['active']? <button value={'{"stationId":"'+data['stationId']+'", "mode": "disable"}'} onClick={handleStationModeButton}>Wyłącz pomiary</button>
        : <button value={'{"stationId":"'+data['stationId']+'", "mode": "enable"}'} onClick={handleStationModeButton}>Włącz pomiary</button>
      }
      <select name="measureInterval" id="measureInterval" onChange={(event)=>handleChangeMeasureInterval(event.target.value, data['stationId'])} value={data['measureInterval']} >
          <option value="3min">3min</option>
          <option value="5min">5min</option>
          <option value="10min">10min</option>
          <option value="15min">15min</option>
        </select>
      <select name="visibility" id="visibility" onChange={(event)=>handleChangeVisibility(event.target.value, data['stationId'])} value={data['visible']} >
          <option value="true">Publiczna</option>
          <option value="false">Prywatna</option>
      </select>
  
      </div>)
    }))
  }

  const renderBookmarkStationItemList = (stationlist) =>{
    return (stationlist.map((data,idx)=>{
      console.log(data)
      return (<div key={idx} style={{
        backgroundColor: '#DDDDDD'
      }}>
      <h3>{data['stationName']}</h3>
      <p>{data['stationId']}</p>
      {data['visible']?<p id="visibility">Publiczna</p> :
      <p id="visibility">Prywatna</p> }
  
      <button>Pokaż na mapie</button>
      {
        data['active'] ? <><p>Enabled</p></> : <><p>Disabled</p></>
      }
      </div>)
    }))
  }

  return (
    <>   
<div className="d-flex p-2 col-example">
  <NavList/>
</div>

      <div className="d-flex p-2 col-example">
      {!stateIsLoggedIn ?
        <div className="Login">
          <h3>Musisz się zalogować</h3>
          <div>
            <button onClick={handleClickLogin}>Go to login</button>
          </div>
        </div>
        : <div className="StationList">
          <div className="my-stations">
            <h2>Moje stacje</h2>
            {stateMyStationList.length>0 ? 
            <>{renderMyStationItemList(stateMyStationList)}</>
            :
            <><p>(Empty list)</p>
            </>
            }
            </div>
            <div className="watched-stations">
            <h2>Zakładki</h2>
            {stateBookmarkStationList.length>0 ? 
            <>{renderBookmarkStationItemList(stateBookmarkStationList)}</>
            :
            <><p>(Empty list)</p>
            </>
            }
            </div>
          </div>

      }
      
      </div>
    </>
  )
}

export default UserStationList;