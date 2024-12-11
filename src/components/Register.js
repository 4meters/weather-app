import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

import SideMenu from "./nav/SideMenu";
import Header from "./styling-components/Header";
import {Button} from "react-bootstrap";
import {registerUserRequest} from '../API/LoginAPI'

function Register(props) {


  const [stateLogin,setStateLogin] = useState("");
  const [statePassword,setStatePassword] = useState("");
  const [stateIsRegistered,setStateIsRegistered] = useState(false);
  const [stateIsFailedRegister,setStateIsFailedRegister] = useState(false);

  const navigate = useNavigate();


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

  const handleRegisterUser = e => {
    e.preventDefault();
    if(validateLoginData()){
      registerUserRequest(stateLogin, statePassword, (res)=>{
        if(res.status===201){
          setStateIsRegistered(true);
          setStateIsFailedRegister(false);
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
          <SideMenu/>
        </div>

        <div className="content-padding">
          <Header headerText="Rejestracja"/>
          {!stateIsRegistered ?
              <div id="login">
                <form onSubmit={handleRegisterUser}>
                  <label>Login:<p/>
                    <input className="form-control" type="text" value={stateLogin} onChange={handleChangeLogin}/>
                  </label>
                  <p/>
                  <label>Hasło:<p/>
                    <input className="form-control" type="password" value={statePassword} onChange={handleChangePassword}/>
                  </label><p/>
                  <input className="btn btn-primary" type="submit" value="Zarejestruj"/>
                </form>
                <div>
                </div>
                <h3 className="mt16">Posiadasz już konto?</h3>
                <div>
                  <Button onClick={handleClickLogin}>Zaloguj się</Button>
                </div>

              </div>
              :

              <div id="registered">
                <h3>Zarejestrowano</h3>
                <Button onClick={handleClickLogin}>Przejdź do strony logowania</Button>
              </div>


          }

        </div>
      </>
  )
}

export default Register;