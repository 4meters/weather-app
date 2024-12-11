import {BASE_SERVER_URL} from "../ServerURL";

export const switchStationModeRequest = (data, stateToken, callback) => {
    data = JSON.parse(data)
    const requestParams = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": stateToken,
            "stationId": data['stationId'],
            "mode": data['mode']
        })
    };
    fetch(BASE_SERVER_URL + `/api/station/mode-switch`, requestParams)
        .then(response => {
            if (response.status === 200) {
                callback && callback();
            }
        })
}

export const removeStationRequest = (stationId, stateToken, callback) => {
    //data=JSON.parse(data)
    const requestParams = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": stateToken,
            "stationId": stationId,
            "removeMeasures": true
        })
    };
    fetch(BASE_SERVER_URL + `/api/admin/remove-station`, requestParams)
        .then(response => {
            if (response.status === 200) {
                //getUserList();
                alert("Stacja pogodowa została usunięta")
                callback && callback();
            } else {
                throw new Error(response.status.toString())
            }
        })
        .catch((error) => {
            console.log('error: ' + error)
            alert("Nie udało się usunąć stacji pogodowej")
        })

}

export const removeStationFromDbRequest = (stationId, stateToken, callback) => {
    //data=JSON.parse(data)
    const requestParams = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": stateToken,
            "stationId": stationId,
            "removeMeasures": true
        })
    };
    fetch(BASE_SERVER_URL + `/api/admin/remove-station-from-db`, requestParams)
        .then(response => {
            if (response.status === 200) {
                //getUserList();
                alert("Stacja pogodowa została usunięta z bazy danych")
                callback && callback()
            } else {
                throw new Error(response.status.toString())
            }
        })
        .catch((error) => {
            console.log('error: ' + error)
            alert("Nie udało się usunąć stacji pogodowej z bazy danych")
        })

}

export const resetUserPasswordRequest = (userId, stateToken, callback) => {
    //data=JSON.parse(data)
    const requestParams = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": stateToken,
            "userId": userId
        })
    };
    fetch(BASE_SERVER_URL + `/api/admin/reset-user-password`, requestParams)
        .then(response => {
            if (response.status === 200) {
                return response.json()
            } else {
                throw new Error(response.status.toString())
            }
        }).then((res) => {
        alert('Hasło zostało zresetowane. Nowe hasło: ' + res['newPassword'])
    })
        .catch((error) => {
            console.log('error: ' + error)
            //here if 400, 403
            alert("Nie udało się zresetować hasła użytkownika")
        })

}

export const removeUserAccountRequest = (userId, stateToken, callback) => {

    //data=JSON.parse(data)
    const requestParams = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": stateToken,
            "userId": userId
        })
    };
    fetch(BASE_SERVER_URL + `/api/admin/remove-user`, requestParams)
        .then(response => {
            if (response.status === 200) {
                alert('Konto użytkownika zostało usunięte')
                callback && callback()
            }

        })
        .catch((error) => {
            console.log('error: ' + error)
            //here if 400, 403
            alert("Nie udało się usunąć konta użytkownika")
        })

}

export const addStationToDbRequest = (event, stateToken, stateNewStationId, stateNewStationKey, callback) => {
    event.preventDefault();
    //data=JSON.parse(data)
    const requestParams = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": stateToken,
            "stationId": stateNewStationId,
            "stationKey": stateNewStationKey
        })
    };
    fetch(BASE_SERVER_URL + `/api/admin/add-station-to-db`, requestParams)
        .then(response => {
            if (response.status === 200) {
                callback && callback()
            } else {
                throw new Error(response.status.toString())
            }
        })
        .catch((error) => {
            console.log('error: ' + error)
            //here if 400, 403
            alert("Nie udało dodać stacji do bazy danych")
        })

}

export const setMeasureIntervalRequest = (measureInterval, stationId, stateToken, callback) => {
    const requestParams = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": stateToken,
            "stationId": stationId,
            "measureInterval": measureInterval
        })
    };
    fetch(BASE_SERVER_URL + `/api/station/set-measure-interval`, requestParams)
        .then(response => {
            if (response.status === 200) {
                callback && callback()
            }
        })

}

export const setVisibilityRequest = (visibility, stationId, stateToken, callback) => {
    const requestParams = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": stateToken,
            "stationId": stationId,
            "visibility": visibility
        })
    };
    fetch(BASE_SERVER_URL + `/api/station/set-visibility`, requestParams)
        .then(response => {
            if (response.status === 200) {
                callback && callback()
            }
        })

}