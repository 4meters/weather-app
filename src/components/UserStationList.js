import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
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

  const renderStationItem = (data) =>{//TODO add idx id div
    console.log(data)
    console.log(data[0]['active'])
    return (<div style={{
      backgroundColor: '#DDDDDD'
    }}>
    <h3>{data[0]['stationName']}</h3>
    <p>{data[0]['stationId']}</p>
    {data[0]['visible']?<p id="visibility">Public</p> :
    <p id="visibility">Private</p> }

    <button>Show on map</button>
    {
      data[0]['active']? <button value={'{"stationId":"'+data[0]['stationId']+'", "mode": "disable"}'} onClick={handleStationModeButton}>Disable measures</button>
      : <button value={'{"stationId":"'+data[0]['stationId']+'", "mode": "enable"}'} onClick={handleStationModeButton}>Enable measures</button>
    }
    <select name="measureInterval" id="measureInterval" onChange={(event)=>handleChangeMeasureInterval(event.target.value, data[0]['stationId'])} value={data[0]['measureInterval']} >
        <option value="3min">3min</option>
        <option value="5min">5min</option>
        <option value="10min">10min</option>
        <option value="15min">15min</option>
      </select>

    </div>)
  }

  const renderBookmarkStationItem = (data) =>{//TODO add idx id div
    console.log(data)
    console.log(data[0]['active'])
    return (<div style={{
      backgroundColor: '#DDDDDD'
    }}>
    <h3>{data[0]['stationName']}</h3>
    <p>{data[0]['stationId']}</p>
    {data[0]['visible']?<p id="visibility">Public</p> :
    <p id="visibility">Private</p> }

    <button>Show on map</button>
    {
      data[0]['active'] ? <><p>Enabled</p></> : <><p>Disabled</p></>
    }
    </div>)
  }

  const renderStationItemList = (stationlist) =>{
    return (stationlist.map(()=>renderStationItem(stationlist)))
  }

  const renderBookmarkStationItemList = (stationlist) =>{
    return (stationlist.map(()=>renderBookmarkStationItem(stationlist)))
  }

  return (
    <>   
<div className="d-flex p-2 col-example">
  <NavList/>
</div>

      <div className="d-flex p-2 col-example">
      {!stateIsLoggedIn ?
        <div className="Login">
          <h3>You need to login</h3>
          <div>
            <button onClick={handleClickLogin}>Go to login</button>
          </div>
        </div>
        : <div className="StationList">
          <div className="my-stations">
            <h2>My stations</h2>
            {stateMyStationList.length>0 ? 
            <>{renderStationItemList(stateMyStationList)}</>
            :
            <><p>(Empty list)</p>
            </>
            }
            </div>
            <div className="watched-stations">
            <h2>Bookmarks</h2>
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

/*<div className="Login">
        <form onSubmit={this.handleLoginUser}>
          <label>Login:<p/>
            <input type="text" value={this.state.login} onChange={this.handleChangeLogin} />
          </label>
          <p/>
          <label>Password:<p/>
            <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
          </label><p/>
          <input type="submit" value="Login" />
        </form>
      </div> */
/*

import React, { useState } from "react";

import Form from "react-bootstrap/Form";

import Button from "react-bootstrap/Button";

import "./Login.css";

export default function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  function validateForm() {

    return email.length > 0 && password.length > 0;

  }

  function handleSubmit(event) {

    event.preventDefault();

  }

  return (

    <div className="Login">

      <Form onSubmit={handleSubmit}>

        <Form.Group size="lg" controlId="email">

          <Form.Label>Email</Form.Label>

          <Form.Control

            autoFocus

            type="email"

            value={email}

            onChange={(e) => setEmail(e.target.value)}

          />

        </Form.Group>

        <Form.Group size="lg" controlId="password">

          <Form.Label>Password</Form.Label>

          <Form.Control

            type="password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

          />

        </Form.Group>

        <Button block size="lg" type="submit" disabled={!validateForm()}>

          Login

        </Button>

      </Form>

    </div>

  );

}
/*for(let el of stationList){
                let markerPosition=[el['geolocationCoordinateN'], el['geolocationCoordinateE']];
                markers.push(markerPosition);
              }*/

/*this.state [markers, setMarkers] = useState([
    {
      position: { lng: -122.673447, lat: 45.5225581 },
      text: "Voodoo Doughnut"
    }
  ]);*/

/*handleClick = () => {
    setMarkers([
      {
        position: { lng: -110.673447, lat: 40.5225581 },
        text: "Voodoo Doughnut"
      },
      {
        position: { lng: -110.6781446, lat: 40.5225512 },
        text: "Bailey's Taproom"
      },
      {
        position: { lng: -110.67535700000002, lat: 40.5192743 },
        text: "Barista"
      }
    ]);
  };*/

  /*    
          /*for(let el of stationList){
                let markerPosition=[el['geolocationCoordinateN'], el['geolocationCoordinateE']];
                markers.push(markerPosition);
              }*/
          /*    let size = stationList['stationList'].length;
              for(var i = 0; i < size ; i++){
                let item = stationList['stationList'][i];
                var markerPosition=[item['geolocationCoordinateN'], item['geolocationCoordinateE'], item['stationId']];
                markers.push(markerPosition);
              }
              console.log(stationList);
              console.log(markers);
              this.setState({
                  ...this.state,
                  stationList
              });
              this.setState({
                ...this.state,
                markers
            });
          })*/