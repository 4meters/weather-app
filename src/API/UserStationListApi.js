import {BASE_SERVER_URL} from "../ServerURL";

export const getUserStationListRequest = (stateToken, callback) => {
    //TODO add status check
    //TODO empty list catch
    fetch(BASE_SERVER_URL+`/api/user/get-user-stationlist/`+stateToken)
        .then(res => res.json())
        .then(response => {
            callback && callback(response)
            //console.log(response)
        })
}

export const removeStationRequest=(stationId, stateToken, callback)=>{
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "token": stateToken,
            "stationId" : stationId,
            "removeMeasures": true
        })
    };
    fetch(BASE_SERVER_URL+`/api/station/remove-station`,requestParams)
        .then(response => {
            callback && callback(response)
        })

}

export const switchStationModeRequest=(data, stateToken, callback)=>{
    data=JSON.parse(data)
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "token": stateToken,
            "stationId" : data['stationId'],
            "mode": data['mode']
        })
    };
    fetch(BASE_SERVER_URL+`/api/station/mode-switch`,requestParams)
        .then(response => {
            callback && callback(response)
        })

}

export const setMeasureIntervalRequest=(stateToken, measureInterval, stationId, callback)=>{
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "token": stateToken,
            "stationId" : stationId,
            "measureInterval": measureInterval
        })
    };
    fetch(BASE_SERVER_URL+`/api/station/set-measure-interval`,requestParams)
        .then(response => {
            callback && callback(response)
        })

}

export const setVisibilityRequest=(stateToken, visibility, stationId, callback)=>{
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "token": stateToken,
            "stationId" : stationId,
            "visibility": visibility
        })
    };
    fetch(BASE_SERVER_URL+`/api/station/set-visibility`,requestParams)
        .then(response => {
            callback && callback(response)
        })

}

export const saveStationNameRequest = (stateToken, newStationName, data, callback) =>{
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "token": stateToken,
            "stationId" : data['stationId'],
            "newStationName": newStationName
        })
    };
    fetch(BASE_SERVER_URL+`/api/station/change-station-name`,requestParams)
        .then(response => {
            callback && callback()
        })
}