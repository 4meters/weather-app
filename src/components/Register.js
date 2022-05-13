import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
//import 'SideNavigation.js'

//https://codereview.stackexchange.com/questions/235854/react-setstate-function-in-useeffect

function Register(props) {


  const [stateFirstRun,setStateFirstRun] = useState(true);
  const [stateLogin,setStateLogin] = useState("");
  const [statePassword,setStatePassword] = useState("");
  const [stateIsRegistered,setStateIsRegistered] = useState(false);
  const [stateIsFailedRegister,setStateIsFailedRegister] = useState(false);

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

  
  useEffect(() => {console.log(stateIsFailedRegister)}, [stateIsFailedRegister])

  const handleChangeLogin = event => {
    setStateLogin(event.target.value);
  }

  const handleChangePassword = event => {
    setStatePassword(event.target.value);
  }

  const handleRegisterUser = event => {
    event.preventDefault();
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "login" : stateLogin,
        "password" : statePassword
    })
    };
    //TODO add status check

    fetch(`http://127.0.0.1:8080/api/user/register`, requestParams)
        .then(response => {
            if(response.status===201){
              setStateIsRegistered(true);
              setStateIsFailedRegister(false);
              console.log("201")
            }
            else{
              setStateIsFailedRegister(true);
              setStateIsRegistered(false);
            }
            //if 201!
            
        })
  }


  const handleClickLogin = () =>{
    navigate("/login")
  }

  return (
    <>   
<div className="d-flex p-2 col-example">
  <NavList/>
</div>

      <div className="d-flex p-2 col-example">
      <h1>Rejestracja</h1>
      {!stateIsRegistered ?
        <div className="Login">
          <form onSubmit={handleRegisterUser}>
            <label>Login:<p/>
              <input type="text" value={stateLogin} onChange={handleChangeLogin} />
            </label>
            <p/>
            <label>Hasło:<p/>
              <input type="password" value={statePassword} onChange={handleChangePassword} />
            </label><p/>
            <input type="submit" value="Zarejestruj" />
          </form>
          <div>
          {stateIsFailedRegister ?
            <div><h2>Register failed</h2></div>
            : <> </>
          }</div>
          <h3>Posiadasz już konto?</h3>
          <div>
            <button onClick={handleClickLogin}>Zaloguj się</button>
          </div>
          
        </div>
        : 
          
          <div className="GoToLogin">
          <h3>Succesfully registered</h3>
          <button onClick={handleClickLogin}>Go To Login</button>
          </div>
          

      }
      
      </div>
    </>
  )
}

export default Register;