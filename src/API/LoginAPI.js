import {BASE_SERVER_URL} from "../ServerURL";

export const loginUserRequest = (stateLogin, statePassword, callback) => {

    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "login" : stateLogin,
            "password" : statePassword
        })
    };

    fetch(BASE_SERVER_URL+`/api/user/login`, requestParams)
        .then(res => res.json())
        .then(response => {
            callback && callback(response)
        })
        .catch((error)=>{
            console.log('error: '+error)
            alert("Błędny login lub hasło")
        })
}

export const changePasswordRequest = (e, stateOldPassword, stateNewPassword, stateToken, callback) =>{
    e.preventDefault();
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
            callback && callback(res)
        })
}

export const removeUserRequest = (statePassword, stateToken, callback) =>{
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
            callback && callback(res)
        })
}

export const registerUserRequest = (stateLogin, statePassword, callback) => {
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
            callback && callback(response)
        })
}