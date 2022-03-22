import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const data = [
  {
    name: 'Page A',
    temp: 0,
    humidity: 0,
    pressure: 0,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const data2 = [
  {
    "date": "2021-12-28T23:48:14.296+00:00",
    "temp": -8.27
},
{
    "date": "2021-12-28T23:50:15.667+00:00",
    "temp": -8.4
},
{
    "date": "2021-12-28T23:52:16.587+00:00",
    "temp": -8.54
},
{
    "date": "2021-12-28T23:54:17.512+00:00",
    "temp": -8.64
},
{
    "date": "2021-12-28T23:55:40.226+00:00",
    "temp": -8.7
},
{
    "date": "2021-12-28T23:57:41.163+00:00",
    "temp": -8.8
},
{
    "date": "2021-12-29T01:35:30.765+00:00",
    "temp": -9.05
},
{
    "date": "2021-12-29T01:38:02.218+00:00",
    "temp": -9.09
},
{
    "date": "2021-12-29T19:33:43.747+00:00",
    "temp": -0.96
},
{
    "date": "2021-12-29T19:36:00.192+00:00",
    "temp": -0.95
},
{
    "date": "2021-12-29T19:38:01.345+00:00",
    "temp": -0.94
},
{
    "date": "2021-12-29T19:40:02.596+00:00",
    "temp": -0.94
},
{
    "date": "2021-12-29T23:05:12.665+00:00",
    "temp": -1.83
},
{
    "date": "2021-12-29T23:09:30.344+00:00",
    "temp": -1.77
},
{
    "date": "2021-12-29T23:13:31.239+00:00",
    "temp": -1.74
},
{
    "date": "2021-12-29T23:17:32.177+00:00",
    "temp": -1.68
},
{
    "date": "2021-12-29T23:21:33.120+00:00",
    "temp": -1.76
},
{
    "date": "2021-12-29T23:25:34.074+00:00",
    "temp": -1.77
},
{
    "date": "2021-12-29T23:29:34.968+00:00",
    "temp": -1.83
},
{
    "date": "2021-12-29T23:33:35.934+00:00",
    "temp": -1.89
},
{
    "date": "2021-12-29T23:37:37.199+00:00",
    "temp": -1.92
},
{
    "date": "2021-12-29T23:41:38.110+00:00",
    "temp": -1.88
},
{
    "date": "2021-12-29T23:45:38.990+00:00",
    "temp": -1.82
},
{
    "date": "2021-12-29T23:49:39.835+00:00",
    "temp": -1.78
},
{
    "date": "2021-12-29T23:53:40.814+00:00",
    "temp": -1.82
},
{
    "date": "2021-12-29T23:57:41.786+00:00",
    "temp": -1.86
},
{
    "date": "2021-12-30T00:01:42.665+00:00",
    "temp": -1.82
},
{
    "date": "2021-12-30T00:05:43.600+00:00",
    "temp": -1.89
},
{
    "date": "2021-12-30T00:09:44.420+00:00",
    "temp": -1.86
},
{
    "date": "2021-12-30T00:13:45.307+00:00",
    "temp": -1.87
},
{
    "date": "2021-12-30T00:17:46.241+00:00",
    "temp": -1.77
},
{
    "date": "2021-12-30T00:21:47.193+00:00",
    "temp": -1.75
},
{
    "date": "2021-12-30T00:25:48.142+00:00",
    "temp": -1.76
},
{
    "date": "2021-12-30T00:29:49.032+00:00",
    "temp": -1.73
},
]

export default class Chart extends PureComponent {
  state = {
    stationId: "00000000e34ec9d1",
    measuresList: []
  };
  static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';

  componentDidMount() {
    this.getMeasureList();
    console.log(this.state.measuresList)
    console.log(data2)
  }

  getMeasureList = () => {
      const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "apiKey" : "DH1_D3JJ9WCWBLIFYBSWN5T68GSM7W_C",
          "stationId": "00000000e34ec9d1",
          "dateFrom" : "2022-03-05T00:00:00.000Z",
          "dateTo" : "2022-03-07T03:00:00.000Z"
      })
      };
 
      fetch(`http://127.0.0.1:8080/api/measure/measure-by-date-chart`, requestParams)
          .then(res => res.json())
          .then(measuresList => {
              /*let markers = [];
              let size = stationList['stationList'].length;
              for(var i = 0; i < size ; i++){
                let item = stationList['stationList'][i];
                var markerPosition=[item['geolocationCoordinateN'], item['geolocationCoordinateE'], item['stationId']];
                markers.push(markerPosition);
              }
              console.log(stationList);
              console.log(markers);
              this.setState({
                  ...this.state,
                  stationList
              });*/
              measuresList=measuresList['chartTempDtoList'];
              this.setState({
                ...this.state,
                measuresList
            });
            //console.log(measuresList);
          })
  }

  render() {
    return (
      <>
      <div>
      
        <LineChart
          width={500}
          height={300}
          data={this.state.measuresList}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>

      </div>
      </>
    );
  }
}
