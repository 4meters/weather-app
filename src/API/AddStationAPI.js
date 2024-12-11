import {BASE_SERVER_URL} from "../ServerURL";

export const stationIdCheckRequest = (stateStationId, stateStationKey, stateToken, callback) => {
    console.log(stateStationId)
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "stationId" : stateStationId,
            "stationKey" : stateStationKey,
            "token": stateToken
        })
    };

    fetch(BASE_SERVER_URL+`/api/station/verify-station`, requestParams)
        .then(response => {
            callback && callback(response)
        })
}

export const addStationFinalRequest = (stateToken, stationId, stationKey, stateNewMarker, stateNewStationName,
                                             stateNewStationVisibility, callback) => {
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "token": stateToken,
            "stationId" : stationId,
            "stationKey" : stationKey,
            "lat" : stateNewMarker[0],
            "lng" : stateNewMarker[1],
            "stationName" : stateNewStationName,
            "visible" : stateNewStationVisibility
        })
    };

    fetch(BASE_SERVER_URL+`/api/station/add-station-on-map`, requestParams)
        .then(response => {
            callback && callback(response)
        })
}