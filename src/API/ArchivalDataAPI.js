import {BASE_SERVER_URL} from "../ServerURL";

export const getMeasureListRequest = ({data}, callback) => {
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "token" : data.token,
            "stationId": data.stationId,
            "dateFrom" : data.dateFrom,
            "dateTo" : data.dateTo,
            "timezone": data.timezone,
            "chartType": data.chartType,
            "chartValue": data.chartValue
        })
    };

    fetch(BASE_SERVER_URL+`/api/measure/measure-by-date-chart`, requestParams)
        .then(res => res.json())
        .then(res => {
            callback && callback(res)
        })
}