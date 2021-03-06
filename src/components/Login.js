import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

import {BASE_SERVER_URL} from '../ServerURL'

function Login(props) {


  const [stateLogin,setStateLogin] = useState("");
  const [statePassword,setStatePassword] = useState("");
  const [stateIsOnRemovingAccount, setStateIsOnRemovingAccount] = useState(false);

  const [stateOldPassword,setStateOldPassword] = useState("");
  const [stateNewPassword,setStateNewPassword] = useState("");
  const [stateIsOnPasswordChange,setStateIsOnPasswordChange] = useState(false);

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);

  //const BASE_SERVER_URL = "http://127.0.0.1:8080"
  //const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"
  
  const navigate = useNavigate();


  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const validateLoginData = () => {

    if(stateLogin.length>0 && statePassword.length>0){
      return true;
    }
    else{
      return false;
    }

  }

  useEffect(() =>{
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
    console.log("Logged in:"+stateIsLoggedIn)
  }, [])


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
    if(validateLoginData()){
      const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "login" : stateLogin,
          "password" : statePassword
      })
      };

      fetch(BASE_SERVER_URL+`/api/user/login`, requestParams)
          .then(response => {
            if(response.status===201){
              return response.json()
            }
            else{
              throw new Error(response.status)
            }
          }).then((response)=>{
            console.log(response['token']);
              let token = response['token']
              setStateToken(token);
              setStateIsLoggedIn(true);
              localStorage.setItem('login', stateLogin);
              localStorage.setItem('token', token);
          })
          .catch((error)=>{
            console.log('error: '+error)
            alert("B????dny login lub has??o")
          })
      }
      else{
        alert("Pole login i has??o nie mog?? by?? puste")
      }
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

    fetch(BASE_SERVER_URL+`/api/user/change-password`, requestParams)
        .then(res => {
          console.log(res.status)
            if(res.status==201){
              setStateIsOnPasswordChange(false);
              alert("Has??o zosta??o zmienione")
            }
            else{
              setStateIsOnPasswordChange(false);              
              alert("Nie uda??o si?? zmieni?? has??a")
            }
            
        })
  }

  const handleRemoveUserRequest = event =>{
    event.preventDefault();
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "password" : statePassword,
        "token": stateToken
    })
    };

    fetch(BASE_SERVER_URL+`/api/user/remove-user`, requestParams)
        .then(res => {
          console.log(res.status)
            if(res.status==200){
              setStateIsOnRemovingAccount(false);
              setStateToken("");
              setStateIsLoggedIn(false);
              setStateLogin("");
              setStatePassword("");
              localStorage.setItem("login","")
              localStorage.setItem("token","");
              alert("Konto zosta??o usuni??te")
            }
            else{
              setStateIsOnRemovingAccount(false);              
              alert("Nie uda??o si?? usun???? konta")
            }
            
        })
  }

  const handleClickLogout = () =>{
    setStateIsLoggedIn(false);
    setStateToken("");
    localStorage.setItem("login","")
    localStorage.setItem('token',"");
  }

  const handleClickChangePassword = () =>{
    setStateIsOnPasswordChange(true);
    setStateIsOnRemovingAccount(false);
  }

  const handleClickRegister = () =>{
    navigate("/register")
  }

  const handleRemoveUserButtonFirstStage = () =>{
    setStatePassword("");
    setStateIsOnRemovingAccount(true);
    setStateIsOnPasswordChange(false);
  }

  const handleRemoveUserSecondStage = (event) =>{
    let result = window.confirm("Czy na pewno chcesz usun???? swoje konto?");
    if(result){
      handleRemoveUserRequest(event);
    }
    else{
      setStateIsOnRemovingAccount(false);
      alert("Anulowano usuwanie konta")
    }
  }


  return (
    <>   
<div>
  <NavList/>
</div>

      <div>
      {!stateIsLoggedIn ?
        <div id="Login">
          <h1>Logowanie</h1>
          <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
          <form onSubmit={handleLoginUser}>
            <label>Login:<p/>
              <input type="text" value={stateLogin} onChange={handleChangeLogin} />
            </label>
            <p/>
            <label>Has??o:<p/>
              <input type="password" value={statePassword} onChange={handleChangePassword} />
            </label><p/>
            <input type="submit" value="Zaloguj si??" />
          </form>
          <h3>Nie posiadasz konta?</h3>
          <div>
            <button onClick={handleClickRegister}>Zajerestruj si??</button>
          </div>
        </div>
        : <>

        <div id="Profile">
          <h1>Konto u??ytkownika</h1>
          <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
          
          {!stateIsOnPasswordChange ? 
          <>
          <h3>{localStorage.getItem("login")}</h3>
          <button onClick={handleClickChangePassword}>Zmie?? has??o</button>
          </> 
          : <>
          <form onSubmit={handleChangePasswordRequest}>
            <label>Stare has??o:<p/>
              <input type="password" value={stateOldPassword} onChange={handleChangeOldPassword} />
            </label>
            <p/>
            <label>Nowe has??o:<p/>
              <input type="password" value={stateNewPassword} onChange={handleChangeNewPassword} />
            </label><p/>
            <input type="submit" value="Zmie?? has??o" />
          </form>
          </>}
        
        </div>

        <div id="Logout">
          <button onClick={handleClickLogout}>Wyloguj si??</button>
        </div>
        {!stateIsOnRemovingAccount ?
        <div style={{paddingTop:"30px"}}>
          <button style={{backgroundColor: "red", color: "white", borderRadius: "6px"}} onClick={()=>handleRemoveUserButtonFirstStage()}>Usu?? konto</button>
        </div>
        : <div>
          <h3>Podaj has??o do konta aby je usun????:</h3>
          <form onSubmit={handleRemoveUserSecondStage}>
            <label>Has??o:<p/>
              <input type="password" value={statePassword} onChange={handleChangePassword} />
            </label>
            <p/>
            <input type="submit" style={{backgroundColor: "red", color: "white", borderRadius: "6px"}} value="Usu?? konto" />
          </form>
          </div>}
        </>
      }
      
      </div>
    </>
  )
}

export default Login;
