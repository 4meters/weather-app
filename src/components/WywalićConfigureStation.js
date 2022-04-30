import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import invariant from 'invariant';

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
//import * as Bluetooth from 'react-bluetooth';
//import 'SideNavigation.js'

//https://codereview.stackexchange.com/questions/235854/react-setstate-function-in-useeffect

function ConfigureStation(props) {


  const [stateIsBluetoothSupported,setStateIsBluetoothSupported] = useState(false);
  const [stateLogin,setStateLogin] = useState("");
  const [statePassword,setStatePassword] = useState("");
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

  const checkBluetoothSupport = async() =>{
    /*const _navigator = navigator;
    try{invariant(_navigator.bluetooth, 'This device is not capable of using Bluetooth');}
    catch{
      console.log("ERROR");
    }
    return _navigator.bluetooth;*/
    console.log(navigator)
    navigator.bluetooth.requestDevice({acceptAllDevices: true})
         .then(device => {
              console.log(device);
         });
    /*navigator.bluetooth.getAvailability().then(available => {
      if (available){
          console.log("This device supports Bluetooth!");
          setStateIsBluetoothSupported(true);
        }
      else{
          console.log("Doh! Bluetooth is not supported");
          setStateIsBluetoothSupported(false);
        }
    });*/
    /*if (await Bluetooth.getAvailabilityAsync()) {
      console.log("Bluetooth available")
    }
    else{
      console.log("Bluetooth not available")
    }*/
  }

  useEffect(() =>{
    //checkBluetoothSupport();
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


  const handleClickLogout = () =>{
    setStateIsLoggedIn(false);
    setStateToken("");
    localStorage.setItem('token',"");
  }


  const handleClickLogin = () =>{
    checkBluetoothSupport();
    //navigate("/login")
  }

  return (
    <>   
<div className="d-flex p-2 col-example">
  <NavList/>
</div>

      <div className="d-flex p-2 col-example">
        <div><p>Bluetooth connection</p></div>
      {!stateIsBluetoothSupported ?
        <div className="Login">
          <h3>You need to login</h3>
          <div>
            <button onClick={handleClickLogin}>Go to login</button>
          </div>
        </div>
        : <div className="StationList">
          <div className="my-stations">
            <p>Bluetooth is here</p>
            </div>
            <div className="watched-stations">

            </div>
          </div>

      }
      
      </div>
    </>
  )
}

export default ConfigureStation;

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