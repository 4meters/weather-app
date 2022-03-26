import React, { useState } from "react";

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
//import 'SideNavigation.js'


class Register extends React.Component  {
  
  state = {
    token: [],
    login: [],
    password: []
  };

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

  handleChangeLogin = (event) => {
    this.setState({login: event.target.value});
  }

  handleChangePassword = (event) => {
    this.setState({password: event.target.value});
  }

  handleRegisterUser = (event) => {
    event.preventDefault();
    //if(this.validateLoginData()){
      const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "email" : this.state.login,
        "password" : this.state.password
    })
    };
    fetch(`http://127.0.0.1:8080/api/user/create`, requestParams)
        .then(res =>{
          console.log(res)
          if(res.status===201){
            alert("Register succesful")
          }
          else{
            alert("Error when registering")
          }
        })
    //}
    //else{
    //  alert("Error")
    //}
    //TODO exception for http status 403
    
  }




  
render(){
  

  return (
    <>   
      <div className="d-flex p-2 col-example">
      <div className="Register">
        <form onSubmit={this.handleRegisterUser}>
          <label>Login:<p/>
            <input type="text" value={this.state.login} onChange={this.handleChangeLogin} />
          </label>
          <p/>
          <label>Password:<p/>
            <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
          </label><p/>
          <input type="submit" value="Register" />
        </form>
      </div>
      </div>
    </>
  );}
}

export default Register;