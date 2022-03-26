import React, { useState } from "react";

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import {Navigate} from "react-router-dom";
import {withRouter} from '../withRouter'
//import 'SideNavigation.js'


class AddStation extends React.Component  {

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
          stationId: "",
          isLoggedIn: true,
          redirect: false,
        }
      }
      else{
        this.state = {
          token: "",
          stationId: "",
          isLoggedIn: false,
          redirect: false,
        }
      }
    }
    else{
      this.state = {
        token: "",
        stationId: "",
        isLoggedIn: false,
        redirect: false,
      }
    }
    
  }


  componentDidMount(){
    console.log("Logged in:"+this.state.isLoggedIn)
  }



  handleChangeStationId = (event) => {
       this.setState({stationId: event.target.value});
       //this.loadToken();
  }


  handleStationIdCheck = (event) => {
    event.preventDefault();
    console.log(this.state.stationId)
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "stationId" : this.state.stationId
    })
    };

    fetch(`http://127.0.0.1:8080/api/station/verify-station`, requestParams)
        .then(response => {
            if(response.status==200){
              this.setState({
                redirect: true
              })
            }            
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
  <NavList/>
</div>

      <div className="d-flex p-2 col-example">

      {this.state.redirect&& <Navigate to='/add-station-on-map' replace={true} />}

      {!isLoggedIn ?
        <div className="Login"> 
          <h1>Add new station</h1>
          <h3>Enter your stationId</h3>
          <form onSubmit={this.handleStationIdCheck}>
            <label>StationId:<p/>
              <input type="text" value={this.state.login} onChange={this.handleChangeStationId} />
            </label>
            <p/>
            <input type="submit" value="Send" />
          </form>
        </div>
        : <div className="LoginNeeded">
          <h1>Login required</h1>
          <button onClick={this.handleGoToLoginPage}>Login</button>
          </div>

      }
      
      </div>
    </>
  );}
}
// technically login needed view should not be needed because in navview page will be unavaible in this case
export default withRouter(AddStation);

