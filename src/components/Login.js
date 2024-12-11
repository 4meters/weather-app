import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

import SideMenu from "./nav/SideMenu";
import Header from "./styling-components/Header";
import {Button} from "react-bootstrap";
import * as loginApi from '../API/LoginAPI'

function Login(props) {


  const [stateLogin,setStateLogin] = useState("");
  const [statePassword,setStatePassword] = useState("");
  const [stateIsOnRemovingAccount, setStateIsOnRemovingAccount] = useState(false);

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

  const handleLoginUser = e => {
    e.preventDefault();
    if (validateLoginData()) {
      loginApi.loginUserRequest(stateLogin, statePassword, (response)=>{
        console.log(response)
        console.log(response['token']);
        let token = response['token']
        setStateToken(token);
        setStateIsLoggedIn(true);
        localStorage.setItem('login', stateLogin);
        localStorage.setItem('token', token);
      })
    } else {
      alert("Pole login i hasło nie mogą być puste")
    }
  }

  const handlePasswordChange = e =>{
    e.preventDefault();
    loginApi.changePasswordRequest(stateOldPassword, stateNewPassword, stateToken, (res)=>{
      console.log(res.status)
      if(res.status === 201){
        setStateIsOnPasswordChange(false);
        alert("Hasło zostało zmienione")
      }
      else{
        setStateIsOnPasswordChange(false);
        alert("Nie udało się zmienić hasła")
      }
    })
  }

  const handleRemoveUser = e =>{
    e.preventDefault();
    loginApi.removeUserRequest(statePassword, stateToken, (res)=>{
      console.log(res.status.toString())
      if(res.status === 200){
        setStateIsOnRemovingAccount(false);
        setStateToken("");
        setStateIsLoggedIn(false);
        setStateLogin("");
        setStatePassword("");
        localStorage.setItem("login","")
        localStorage.setItem("token","");
        alert("Konto zostało usunięte")
      }
      else{
        setStateIsOnRemovingAccount(false);
        alert("Nie udało się usunąć konta")
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

  const handleRemoveUserSecondStage = (e) =>{
    let result = window.confirm("Czy na pewno chcesz usunąć swoje konto?");
    if(result){
      handleRemoveUser(e);
    }
    else{
      setStateIsOnRemovingAccount(false);
      alert("Anulowano usuwanie konta")
    }
  }


  return (
      <div>
        <div>
          <SideMenu/>
        </div>

        <div className="content-padding">
          {!stateIsLoggedIn ?
              <div id="Login">
                <Header headerText="Logowanie"/>
                <form onSubmit={handleLoginUser}>
                  <label>Login:<p/>
                    <input className="form-control" type="text" value={stateLogin} onChange={handleChangeLogin}/>
                  </label>
                  <p/>
                  <label>Hasło:<p/>
                    <input className="form-control" type="password" value={statePassword} onChange={handleChangePassword}/>
                  </label><p/>
                  <input className="btn btn-primary" type="submit" value="Zaloguj się"/>
                </form>
                <h3 className="mt32">Nie posiadasz konta?</h3>
                <div className="mt16">
                  <Button onClick={handleClickRegister}>Zarejestruj się</Button>
                </div>
              </div>
              : <>

                <div id="Profile">
                  <Header headerText="Konto użytkownika"/>

                  {!stateIsOnPasswordChange ?
                      <>
                        <h3 className="mt16">{localStorage.getItem("login")}</h3>
                        <Button className="mt8" onClick={handleClickChangePassword}>Zmień hasło</Button>
                      </>
                      : <>
                        <form onSubmit={handlePasswordChange}>
                          <label>Stare hasło:<p/>
                            <input type="password" value={stateOldPassword} onChange={handleChangeOldPassword}/>
                          </label>
                          <p/>
                          <label>Nowe hasło:<p/>
                            <input type="password" value={stateNewPassword} onChange={handleChangeNewPassword}/>
                          </label><p/>
                          <input className="btn btn-primary" type="submit" value="Zmień hasło"/>
                        </form>
                      </>}

                </div>

                <div id="Logout">
                  <Button className="mt8" onClick={handleClickLogout}>Wyloguj się</Button>
                </div>
                {!stateIsOnRemovingAccount ?
                    <div style={{paddingTop: "30px"}}>
                      <Button variant="danger"
                              onClick={() => handleRemoveUserButtonFirstStage()}>Usuń konto
                      </Button>
                    </div>
                    : <div>
                      <h3>Podaj hasło do konta aby je usunąć:</h3>
                      <form onSubmit={handleRemoveUserSecondStage}>
                        <label>Hasło:<p/>
                          <input className="form-control" type="password" value={statePassword} onChange={handleChangePassword}/>
                        </label>
                        <p/>
                        <input className="btn btn-danger" type="submit"
                               value="Usuń konto"/>
                      </form>
                    </div>}
              </>
          }

        </div>
      </div>
  )
}

export default Login;
