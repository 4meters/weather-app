import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

import {BASE_SERVER_URL} from '../ServerURL'

function Register(props) {


  const [stateFirstRun,setStateFirstRun] = useState(true);
  const [stateLogin,setStateLogin] = useState("");
  const [statePassword,setStatePassword] = useState("");
  const [stateIsRegistered,setStateIsRegistered] = useState(false);
  const [stateIsFailedRegister,setStateIsFailedRegister] = useState(false);

  //const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"
  //const BASE_SERVER_URL = "http://127.0.0.1:8080"

  const navigate = useNavigate();


  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const validateLoginData = () => {
    if(stateLogin.length>=3 && statePassword.length>=8){
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
    if(validateLoginData()){
      const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "login" : stateLogin,
          "password" : statePassword
      })
      };

      fetch(BASE_SERVER_URL+`/api/user/register`, requestParams)
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
              
          })
    }
    else{
      alert("Wymagana długość loginu to 3 znaki, hasła 8 znaków")
    }
  }


  const handleClickLogin = () =>{
    navigate("/login")
  }

  return (
    <>   
<div>
  <NavList/>
</div>

      <div>
      <h1>Rejestracja</h1>
      <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
      {!stateIsRegistered ?
        <div id="Login">
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
          </div>
          <h3>Posiadasz już konto?</h3>
          <div>
            <button onClick={handleClickLogin}>Zaloguj się</button>
          </div>
          
        </div>
        : 
          
          <div id="GoToLogin">
          <h3>Zarejestrowano</h3>
          <button onClick={handleClickLogin}>Przejdź do strony logowania</button>
          </div>
          

      }
      
      </div>
    </>
  )
}

export default Register;