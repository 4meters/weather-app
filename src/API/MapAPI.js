import {BASE_SERVER_URL} from "../ServerURL";

export const fetchMarkers = (callback) => {
    fetch(BASE_SERVER_URL + `/api/station/get-public-stationlist`)
        .then(res => res.json())
        .then(stationList => {
            callback && callback(stationList)
        });
}

export const fetchLastMeasures = (callback) => {
    fetch(BASE_SERVER_URL + `/api/measure/last-measure-all`)
        .then(res => res.json())
        .then(response => {
            callback && callback(response)
        })
}

export const fetchPrivateMarkers = (token, callback) => {
    fetch(BASE_SERVER_URL + `/api/user/get-user-mystationlist-details/` + token)
        .then(res => res.json())
        .then(response => {
            callback && callback(response)
        })

}

export const fetchBookmarkMarkers = (token, callback) => {
    fetch(BASE_SERVER_URL + `/api/user/get-user-bookmarkstationlist-details/` + token)
        .then(res => res.json())
        .then(response => {
            callback && callback(response)
        })
}

export const fetchUserStationList = (token, callback) => {
    fetch(BASE_SERVER_URL + `/api/user/get-user-stationlist/` + token)
        .then(res => res.json())
        .then(response => {
            callback && callback(response)
        })
}

export const bookmarkRequest = (token, stationId, operation, callback) => {
    const requestParams = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "token": token,
            "stationId": stationId
        })
    };
    fetch(BASE_SERVER_URL + `/api/user/` + operation + `-bookmark`, requestParams)
        .then(response => {
            callback && callback(response)
        })

}

export const fetchPublicStationList = (callback) => {
    fetch(BASE_SERVER_URL+`/api/station/get-public-stationlist`)
        .then(res => res.json())
        .then(stationList => {
            callback && callback(stationList)
        });
}
