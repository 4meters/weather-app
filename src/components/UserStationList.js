import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Flex from '@react-css/flex'

import EdiText from 'react-editext';

import {BASE_SERVER_URL} from '../ServerURL'
 

function UserStationList(props) {

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);
  const [stateMyStationList,setStateMyStationList] = useState([]);
  const [stateBookmarkStationList,setStateBookmarkStationList] = useState([]);

  //const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"
  //const BASE_SERVER_URL = "http://127.0.0.1:8080"


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
  }, [])

  useEffect(()=>{
    if(stateIsLoggedIn==true){
      getUserStationList();
    }
    
  },[stateToken])

  

  const getUserStationList = () => {
    //TODO add status check
    //TODO empty list catch
    //fetch(`http://127.0.0.1:8080/api/user/get-user-stationlist/`+stateToken)
    fetch(BASE_SERVER_URL+`/api/user/get-user-stationlist/`+stateToken)
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

  const handleClickShowOnMap = (stationId) =>{
    navigate("/?stationId="+stationId)
  }

  const handleRemoveStationButton = (stationId) =>{
    let result = window.confirm("Czy na pewno chcesz usunąć stację pogodową?\nWszystkie wyniki pomiarów zostaną również usunięte.")
    console.log(stationId)
    if(result){
      removeStationRequest(stationId)
    }
    else{
      alert("Stacja pogodowa nie została usunięta")
    }
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

  const removeStationRequest=(stationId)=>{
    //data=JSON.parse(data)
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "stationId" : stationId,
        "removeMeasures": true
    })
    };
    fetch(BASE_SERVER_URL+`/api/user/remove-station`,requestParams)
    .then(response => {
      if(response.status===200){
        alert("Stacja pogodowa została usunięta")
        getUserStationList();
      }
      else{
        throw new Error(response.status)
      }
    })
    .catch((error)=>{
      console.log('error: '+error)
      alert("Nie udało się usunąć stacji pogodowej z bazy danych")
    })

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
    fetch(BASE_SERVER_URL+`/api/station/mode-switch`,requestParams)
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
    fetch(BASE_SERVER_URL+`/api/station/set-measure-interval`,requestParams)
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
    fetch(BASE_SERVER_URL+`/api/station/set-visibility`,requestParams)
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
    fetch(BASE_SERVER_URL+`/api/station/change-station-name`,requestParams)
    .then(response => {
      if(response.status===200){
        getUserStationList();
      }
    })
  }


  const pStyle={marginTop:"2px", marginBottom:"2px"}

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
        
      
      <p style={{fontSize:"12px", marginTop:"-10px"}}>id: {data['stationId']}</p>
      
      <Flex style={{flexDirection: "column"}}>
      <Flex style={{flexDirection: "row"}}>
        <p style={pStyle}><b style={{marginRight: "33px"}}>Widoczność:</b>
        {data['visible']!=null ? <>
      <select name="visibility" id="visibility" onChange={(event)=>handleChangeVisibility(event.target.value, data['stationId'])} value={data['visible']} >
          <option value="true">Publiczna</option>
          <option value="false">Prywatna</option>
      </select>
      </> :<></>}</p>
      </Flex>
      <Flex style={{flexDirection: "row"}}>
      <p style={pStyle}><b style={{marginRight: "10px"}}>Interwał pomiaru:</b>
      {data['measureInterval']!=null && data['measureInterval']!="" ? <>
      <select name="measureInterval" id="measureInterval" onChange={(event)=>handleChangeMeasureInterval(event.target.value, data['stationId'])} value={data['measureInterval']} >
          <option value="3min">3min</option>
          <option value="5min">5min</option>
          <option value="10min">10min</option>
          <option value="15min">15min</option>
        </select>
      </> : <></>}</p>
      </Flex>
      
      <Flex style={{flexDirection: "row"}}>
      {data['active']!=null ? 
      <>
      {
        data['active'] ? <><p style={pStyle}><b>Status: </b>Pomiary włączone</p></> : <><p><b>Status: </b>Pomiary wyłączone</p></>
      }
      </>:<></>}
      </Flex>
      </Flex>
      
      <p/>

      {data['lat']!=null && data['lng']!=null ? <>
      <button onClick={()=>handleClickShowOnMap(data['stationId'])}>Pokaż na mapie</button>
      </> : <></>
      }
      

      {data['active']!=null && data['active']!="" ? <>
        {
          data['active']? <button value={'{"stationId":"'+data['stationId']+'", "mode": "disable"}'} onClick={handleStationModeButton}>Wyłącz pomiary</button>
          : <button value={'{"stationId":"'+data['stationId']+'", "mode": "enable"}'} onClick={handleStationModeButton}>Włącz pomiary</button>
        }
      </> : <></>}
      
      

      <button style={{backgroundColor: "red", color: "white", borderRadius: "6px"}} onClick={()=>handleRemoveStationButton(data['stationId'])}>Usuń stację</button>
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
      <p style={{fontSize:"12px", marginTop:"-10px"}}>id: {data['stationId']}</p>
      {data['visible']?<p id="visibility"><b>Widoczność: </b>Publiczna</p> :
      <p id="visibility"><b>Widoczność: </b>Prywatna</p> }
      {data['active']!=null ? 
      <>
      {
        data['active'] ? <><p><b>Status: </b>Pomiary włączone</p></> : <><p><b>Status: </b>Pomiary wyłączone</p></>
      }
      </>:<></>}
      
      <button onClick={()=>handleClickShowOnMap(data['stationId'])}>Pokaż na mapie</button>
      
      </div>)
    }))
  }

  return (
    <>   
<div>
  <NavList/>
</div>

      <div>
        <h1>Lista stacji</h1>
        <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
      {!stateIsLoggedIn ?
        <div id="Login">
          <h3>Musisz się zalogować</h3>
          <div>
            <button onClick={handleClickLogin}>Zaloguj się</button>
          </div>
        </div>
        : <div id="StationList">
          <div id="my-stations">
            <h2>Moje stacje</h2>
            {stateMyStationList.length>0 ? 
            <>{renderMyStationItemList(stateMyStationList)}</>
            :
            <><p>(Pusta lista)</p>
            </>
            }
            </div>
            <div id="watched-stations">
            <h2>Zakładki</h2>
            {stateBookmarkStationList.length>0 ? 
            <>{renderBookmarkStationItemList(stateBookmarkStationList)}</>
            :
            <><p>(Pusta lista)</p>
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