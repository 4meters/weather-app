import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Flex from '@react-css/flex'


import EdiText from 'react-editext';


//https://codereview.stackexchange.com/questions/235854/react-setstate-function-in-useeffect

function AdminPanel(props) {

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);
  const [stateIsAdmin,setStateIsAdmin] = useState(false);
  const [stateUserList,setStateUserList] = useState([]);
  const [stateStationList,setStateStationList] = useState([]);
  
  const [stateIsAddingNewStation,setStateIsAddingNewStation] = useState(false);
  const [stateNewStationId,setStateNewStationId] = useState("");
  const [stateNewStationKey,setStateNewStationKey] = useState("");
  

  //const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"
  const BASE_SERVER_URL = "http://127.0.0.1:8080"


  const navigate = useNavigate();


  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }


  useEffect(() =>{
    console.log("Logged in:"+stateIsLoggedIn)
    console.log(stateToken);
    let token=localStorage.getItem('token');
    if(typeof(token)==="string"){
      if(token.length>0){
        setStateToken(localStorage.getItem('token'));
        setStateIsLoggedIn(true);
        getUserList();
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
    validateIfAdminRequest(stateToken);
    if(stateIsLoggedIn==true){
      getUserList();
      getStationList();
    }
    
  },[stateToken])


  const getUserList = () => {
    fetch(BASE_SERVER_URL+`/api/admin/get-all-users?token=`+stateToken)
        .then(res => res.json())
        .then(response => {
            setStateUserList(response['userList'])
        })
  }

  const validateIfAdminRequest = () =>{
    fetch(BASE_SERVER_URL+`/api/admin/verify-admin?token=`+stateToken)
      .then(response => {
          //console.log(response)
          if(response.status===200){
            //getUserList();
            setStateIsAdmin(true);
          }
          else{
            throw new Error(response.status)
          }
        })
        .catch((error)=>{
          setStateIsAdmin(false);
          console.log('error: not an admin'+error)
        })
  }
  const getStationList = () => {
    fetch(BASE_SERVER_URL+`/api/admin/get-all-stations?token=`+stateToken)
        .then(res => res.json())
        .then(response => {
            setStateStationList(response['stationList'])
        })
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

  const handleRemoveStationButton = (stationId) =>{
    console.log(stationId)
    let result = window.confirm("Czy na pewno usunąć z mapy stację o id: "+stationId+"?\nZostaną usunięte również wszystkie pomiary.\nStacja będzie mogła być aktywowana w przyszłości")
    if(result){
      removeStationRequest(stationId)
    }
    else{
      alert("Stacja nie została usunięta")
    }
  }

  const handleRemoveStationFromDbButton = (stationId) =>{
    console.log(stationId)
    let result = window.confirm("Czy na pewno usunąć z bazy danych stację o id: "+stationId+"?\nZostaną usunięte również wszystkie pomiary.\nStacja nie będzie mogła być aktywowana w przyszłości")
    if(result){
      removeStationFromDbRequest(stationId)
    }
    else{
      alert("Stacja nie została usunięta z bazy danych")
    }
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
    fetch(BASE_SERVER_URL+`/api/station/mode-switch`,requestParams)
    .then(response => {
      if(response.status===200){
        getStationList();
      }
    })
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
    fetch(BASE_SERVER_URL+`/api/admin/remove-station`,requestParams)
    .then(response => {
      if(response.status===200){
        //getUserList();
        alert("Stacja pogodowa została usunięta")
        getStationList();
      }
      else{
        throw new Error(response.status)
      }
    })
    .catch((error)=>{
      console.log('error: '+error)
      alert("Nie udało się usunąć stacji pogodowej")
    })

  }

  const removeStationFromDbRequest=(stationId)=>{
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
    fetch(BASE_SERVER_URL+`/api/admin/remove-station-from-db`,requestParams)
    .then(response => {
      if(response.status===200){
        //getUserList();
        alert("Stacja pogodowa została usunięta z bazy danych")
        getStationList();
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

  const handleResetUserPasswordButton=(userId, login)=>{
    let result = window.confirm("Czy na pewno chcesz zresetować hasło do konta użytkownika o loginie: "+login)
    if(result){
      resetUserPasswordRequest(userId)
    }
    else{
      alert("Hasło nie zostało zresetowane")
    }
  }

  const resetUserPasswordRequest=(userId)=>{
    //data=JSON.parse(data)
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "userId" : userId
    })
    };
    fetch(BASE_SERVER_URL+`/api/admin/reset-user-password`,requestParams)
    .then(response => {
      if(response.status===200){
        return response.json()
      }
      else{
        throw new Error(response.status)
      }
    }).then((res)=>{
      alert('Hasło zostało zresetowane. Nowe hasło: '+res['newPassword'])
    })
    .catch((error)=>{
      console.log('error: '+error)
      //here if 400, 403
      alert("Nie udało się zresetować hasła użytkownika")
    })

  }

  const handleRemoveUserButton=(userId,login)=>{
    let result = window.confirm("Czy na pewno chcesz usunąć konto użytkownika o loginie: "+login)
    if(result){
      removeUserAccountRequest(userId)
    }
    else{
      alert("Konto nie zostało usunięte")
    }
  }
  const removeUserAccountRequest=(userId)=>{

    //data=JSON.parse(data)
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "userId" : userId
    })
    };
    fetch(BASE_SERVER_URL+`/api/admin/remove-user`,requestParams)
    .then(response => {
      if(response.status===200){
        alert('Konto użytkownika zostało usunięte')
        getUserList();
        getStationList();
      }

    })
    .catch((error)=>{
      console.log('error: '+error)
      //here if 400, 403
      alert("Nie udało się usunąć konta użytkownika")
    })

  }

  const addStationToDbRequest=(event)=>{
    event.preventDefault();
    //data=JSON.parse(data)
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "stationId" : stateNewStationId,
        "stationKey" : stateNewStationKey
    })
    };
    fetch(BASE_SERVER_URL+`/api/admin/add-station-to-db`,requestParams)
    .then(response => {
      if(response.status===200){
        setStateIsAddingNewStation(false);
        getUserList();
        getStationList();
      }
      else{
        throw new Error(response.status)
      }
    })
    .catch((error)=>{
      console.log('error: '+error)
      //here if 400, 403
      alert("Nie udało dodać stacji do bazy danych")
    })

  }

  const handleClickShowOnMap = (stationId) =>{
    navigate("/?stationId="+stationId)
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
        getStationList();
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
        getStationList();
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
        getStationList();
      }
    })
  }

  //const renderStationItem = (data,idx) =>

  //const renderBookmarkStationItem = (data,idx) =>

  const pStyle={marginTop:"2px", marginBottom:"2px"}

  const renderStationList = (stationlist) =>{
    return (stationlist.map((data,idx)=>{//TODO add idx id div
      console.log(data)
      let ref=null;
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
      <p style={{fontSize:"12px", marginTop:"-10px"}}>klucz: {data['stationKey']}</p>

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
      <button style={{backgroundColor: "red", color: "white", borderRadius: "6px"}} onClick={()=>handleRemoveStationFromDbButton(data['stationId'])}>Usuń stację z bazy danych</button>
      </div>)
    }))
  }

  const renderUserList = (userList) =>{
    return (userList.map((data,idx)=>{
      console.log(data)
      return (<div key={idx} style={{
        backgroundColor: '#DDDDDD'
      }}>
      <h3>{data['login']}</h3>
      <p style={{fontSize: "9px", marginTop:"-10px", marginBottom:"-20px"}}>userId:</p>
      <p>{data['userId']}</p>
  
      <button onClick={()=>handleResetUserPasswordButton(data['userId'],data['login'])}>Zresetuj hasło</button>
      <button style={{backgroundColor: "red", color: "white", borderRadius: "6px"}} onClick={()=>handleRemoveUserButton(data['userId'],data['login'])}>Usuń konto</button>

      </div>)
    }))
  }



  return (
    <>   
<div>
  <NavList/>
</div>

      <div>
      {!stateIsLoggedIn || !stateIsAdmin ?
        <div className="Login">
          <h3>Musisz się zalogować z użyciem danych konta administratora</h3>
          <div>
            <button onClick={handleClickLogin}>Strona logowania</button>
          </div>
        </div>
        : <div className="StationList">
          <div className="my-stations">
            <h1>Panel administracyjny</h1>
            <Flex><h2>Stacje pogodowe</h2><button onClick={()=>{setStateIsAddingNewStation(true)}}>Dodaj stację do bazy danych</button></Flex>
            
            {stateIsAddingNewStation ? <>
            <h2>Nowa stacja</h2>
            <h3>Podaj dane stacji:</h3>
            <form onSubmit={addStationToDbRequest}>
              <label>Id stacji:<p/>
                <input type="text" value={stateNewStationId} onChange={(event)=>setStateNewStationId(event.target.value)} />
              </label>
              <p/>
              <label>Klucz stacji:<p/>
                <input type="text" value={stateNewStationKey} onChange={(event)=>setStateNewStationKey(event.target.value)} />
              </label><p/>
              <input type="submit" value="Zapisz stację" />
            </form>
            </> : <></>}

            {stateStationList.length>0 ? 
            <>{renderStationList(stateStationList)}</>
            :
            <><p>(Pusta lista)</p>
            </>
            }
            </div>
            <div className="watched-stations">
            <h2>Użytkownicy</h2>
            {stateUserList.length>0 ? 
            <>{renderUserList(stateUserList)}</>
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

export default AdminPanel;