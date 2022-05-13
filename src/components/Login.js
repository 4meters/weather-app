import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
//import 'SideNavigation.js'

//https://codereview.stackexchange.com/questions/235854/react-setstate-function-in-useeffect

function Login(props) {


  const [stateFirstRun,setStateFirstRun] = useState(true);
  const [stateLogin,setStateLogin] = useState("");
  const [statePassword,setStatePassword] = useState("");

  const [stateOldPassword,setStateOldPassword] = useState("");
  const [stateNewPassword,setStateNewPassword] = useState("");
  const [stateIsOnPasswordChange,setStateIsOnPasswordChange] = useState(false);

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);
  
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


  const handleChangeLogin = event => {
    setStateLogin(event.target.value);
  }

  const handleChangePassword = event => {
    setStatePassword(event.target.value);
  }
  
  const handleChangeOldPassword = event => {
    setStateOldPassword(event.target.value);
  }
  
  const handleChangeNewPassword = event => {
    setStateNewPassword(event.target.value);
  }

  const handleLoginUser = event => {
    event.preventDefault();
    console.log(stateLogin)
    console.log(statePassword)
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "login" : stateLogin,
        "password" : statePassword
    })
    };
    //TODO add status check

    fetch(`http://127.0.0.1:8080/api/user/login`, requestParams)
        .then(res => res.json())
        .then(response => {
            console.log(response['token']);
            let token = response['token']
            setStateToken(token);
            setStateIsLoggedIn(true);
            localStorage.setItem('token', token);
        })
  }

  const handleChangePasswordRequest = event =>{
    event.preventDefault();
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "oldPassword" : stateOldPassword,
        "newPassword" : stateNewPassword,
        "token": stateToken
    })
    };
    //TODO add status check

    fetch(`http://127.0.0.1:8080/api/user/change-password`, requestParams)
        .then(res => {
          console.log(res.status)
            if(res.status==201){
              setStateIsOnPasswordChange(false);
              alert("Succesful password change")
            }
            else{
              setStateIsOnPasswordChange(false);              
              alert("Failed to change password")
            }
            
        })
  }


  const handleClickLogout = () =>{
    setStateIsLoggedIn(false);
    setStateToken("");
    localStorage.setItem('token',"");
  }

  const handleClickChangePassword = () =>{
    setStateIsOnPasswordChange(true);
  }

  const handleClickRegister = () =>{
    navigate("/register")
  }


  return (
    <>   
<div className="d-flex p-2 col-example">
  <NavList/>
</div>

      <div className="d-flex p-2 col-example">
      {!stateIsLoggedIn ?
        <div className="Login">
          <h1>Logowanie</h1>
          
          <form onSubmit={handleLoginUser}>
            <label>Login:<p/>
              <input type="text" value={stateLogin} onChange={handleChangeLogin} />
            </label>
            <p/>
            <label>Hasło:<p/>
              <input type="password" value={statePassword} onChange={handleChangePassword} />
            </label><p/>
            <input type="submit" value="Zaloguj się" />
          </form>
          <h3>Nie posiadasz konta?</h3>
          <div>
            <button onClick={handleClickRegister}>Zajerestruj się</button>
          </div>
        </div>
        : <>

        <div className="Profile">
          <h1>Konto użytkownika</h1>
          {!stateIsOnPasswordChange ? 
          <>
          <button onClick={handleClickChangePassword}>Zmień hasło</button>
          </> 
          : <>
          <form onSubmit={handleChangePasswordRequest}>
            <label>Stare hasło:<p/>
              <input type="password" value={stateOldPassword} onChange={handleChangeOldPassword} />
            </label>
            <p/>
            <label>Nowe hasło:<p/>
              <input type="password" value={stateNewPassword} onChange={handleChangeNewPassword} />
            </label><p/>
            <input type="submit" value="Change password" />
          </form>
          </>}
        
        </div>

        <div className="Logout">
          <button onClick={handleClickLogout}>Wyloguj się</button>
          </div>
        </>
      }
      
      </div>
    </>
  )
}

export default Login;

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