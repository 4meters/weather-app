import React, { useState } from "react";

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
//import 'SideNavigation.js'


class Login extends React.Component  {

  /*state = {
    token: "",
    login: "",
    password: ""
  };
  */
  constructor(){
    super();
    //TODO check if not null in localStorage
    let token=localStorage.getItem('token');
    if(typeof(token)==="string"){
      if(token.length>0){
        this.state = {
          token: localStorage.getItem('token'),
          login: "",
          password: "",
          isLoggedIn: true
        }
      }
    }
    else{
      this.state = {
        token: "",
        login: "",
        password: "",
        isLoggedIn: false
      }
    }
    
  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  validateLoginData() {

    if(this.state.login>0 && this.state.password>0){
      return true;
    }
    else{
      return false;
    }

  }

  componentDidMount(){
    console.log("Logged in:"+this.state.isLoggedIn)
  }


  /*loadToken = () => {
    let token = localStorage.getItem('token');
    console.log(localStorage.getItem('token'))
    this.setState({
      ...this.state, token
    });
    console.log(this.state.token)
  }*/

  handleChangeLogin = (event) => {
       this.setState({login: event.target.value});
       //this.loadToken();
  }

  handleChangePassword = (event) => {
    this.setState({password: event.target.value});
}

  handleLoginUser = (event) => {
    event.preventDefault();
    console.log(this.state.login)
    console.log(this.state.password)
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "email" : this.state.login,
        "password" : this.state.password
    })
    };

    fetch(`http://127.0.0.1:8080/api/user/login`, requestParams)
        .then(res => res.json())
        .then(response => {
            console.log(response['token']);
            let token = response['token']
            this.setState({
                ...this.state,
                token,
                ...this.state,
                isLoggedIn: true
            });
            localStorage.setItem('token', token);
        })
  }

  /*handleRegisterUser = (login,password) => {
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "login" : login,
        "password" : password
    })
    };

    fetch(`http://127.0.0.1:8080/api/user/register`, requestParams)
        .then(res => res.json())
        .then(response => {
            console.log(response['token']);
            let token = response['token']
            this.setState({
                ...this.state,
                token
            });
        })
  }*/

  handleClickLogout = () =>{
    this.setState({
      isLoggedIn: false,
      token: ""
    })
    localStorage.setItem('token',"");
  }



  
render(){
  const isLoggedIn = this.state.isLoggedIn;

  return (
    <>   
      <div className="d-flex p-2 col-example">
      {!isLoggedIn ?
        <div className="Login">
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
        </div>
        : <div className="Logout">
          <button onClick={this.handleClickLogout}>Logout</button>
          </div>

      }
      
      </div>
    </>
  );}
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