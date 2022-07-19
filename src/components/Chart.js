import React, {PureComponent} from 'react';
import {LineChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

import DateTimePicker from 'react-datetime-picker';

import {format, differenceInHours, startOfMonth,
  startOfWeek, startOfDay, endOfDay, sub} from 'date-fns';

import {BASE_SERVER_URL} from '../ServerURL'


//const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"
//const BASE_SERVER_URL = "http://127.0.0.1:8080"

export default class Chart extends PureComponent {
  constructor(props){
    super(props);
    let dateStartInitial= new Date();
    let dateEndInitial= new Date();
    dateStartInitial.setDate(dateStartInitial.getDate() - 7)
    console.log(format(dateStartInitial, 'xxx'));
    this.state = {
      stationId: this.props.stationId,
      measuresList: [],
      dateStart: dateStartInitial,
      dateEnd: dateEndInitial,
      chartType: "max",
      chartValue: "temp",
      chartYAxisUnit: "°C",
      chartWidth: 700
    };
  }
  


  componentDidMount() {
    console.log("stationId: "+this.props.stationId)
    const updateDimensions = () => {
      let width = window.innerWidth;
      if(width < 700){
        this.setState({chartWidth: width})
      }
      else{
        this.setState({chartWidth: 700})
      }
    }
    window.addEventListener('resize', updateDimensions)
    //this.setChartWidth();
    console.log(window.innerWidth)
    this.getMeasureList();
    console.log(this.state.measuresList)
  }


  checkDateDiff = (date, startOrEndDate) =>{
    if(startOrEndDate==="end"){
      let diffHours=differenceInHours(this.state.dateStart, date);
      if(diffHours<=-1){
        return true;
      }
      else{
        return false;
      }
    }
    else if(startOrEndDate==="start"){
      let diffHours=differenceInHours(date, this.state.dateEnd);
      if(diffHours<=-1){
        return true;
      }
      else{
        return false;
      }
    }
  }

  setDateStartEnd = (start, end) =>{
    this.setState({
      dateStart: start,
      dateEnd: end
    }, this.getMeasureList);
  }

  handleDateButton = (buttonId) =>{
    switch(buttonId){
      case "today":{
        let end = new Date();
        let start = startOfDay(end);
        console.log(start)
        this.setDateStartEnd(start, end);
        break
      }
      case "yesterday":{
        let end = endOfDay(sub(new Date(), {days: 1}));
        let start = startOfDay(end);
        this.setDateStartEnd(start, end);
        break
      }
      case "this week":{
        let end = new Date();
        let start = startOfWeek(end, {weekStartsOn: 1});
        this.setDateStartEnd(start, end);
        break
      }
      case "this month":{
        let end = new Date();
        let start = startOfMonth(end);
        this.setDateStartEnd(start, end);
        break
      }
    }
  }

  onChangeDateStart = (date) =>{
    if(this.checkDateDiff(date, "start")){
      this.setState({
        dateStart: date
      }, this.getMeasureList);
    }
    else{
      alert("Minimalna różnica czasu to 1h. Proszę wybrać inną datę")
    }
  }

  onChangeDateEnd = (date) =>{
    if(this.checkDateDiff(date, "end")){
      this.setState({
        dateEnd: date
      }, this.getMeasureList);
    }
    else{
      alert("Minimalna różnica czasu to 1h. Proszę wybrać inną datę")
    }
    
  }

  onChangeChartType = (event) =>{
    console.log(event.target.value)
    this.setState({
      chartType: event.target.value
    },this.getMeasureList);
  }
  
  onChangeChartValue = (event) =>{
    let unitYAxisMapper={"temp": "°C",
                        "humidity": "%",
                        "pressure": "hPa",
                        "pm25": "µg/m³",
                        "pm25Corr": "µg/m³",
                        "pm10": "µg/m³"}
    this.setState({
      chartYAxisUnit: unitYAxisMapper[event.target.value]
    })
    this.setState({
      chartValue: event.target.value,
    },this.getMeasureList);
  }

  getMeasureList = () => {
      const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "token" : localStorage.getItem("token"),
          "stationId": this.state.stationId,
          "dateFrom" : this.state.dateStart.toISOString(),
          "dateTo" : this.state.dateEnd.toISOString(),
          "timezone": format(new Date, 'xxx'),
          "chartType": this.state.chartType,
          "chartValue": this.state.chartValue
      })
      };
 
      fetch(BASE_SERVER_URL+`/api/measure/measure-by-date-chart`, requestParams)
          .then(res => res.json())
          .then(measuresList => {
              measuresList=measuresList['chartDtoList'];
              this.setState({
                ...this.state,
                measuresList
            });
          })
  }


  render() {
    let legend ={"temp": "Temperatura",
    "humidity": "Wilgotność",
    "pressure": "Ciśnienie powietrza",
    "pm25": "PM2.5",
    "pm25Corr": "PM2.5 z korekcją",
    "pm10": "PM10"}
    return (
      
      <>
      <div>
      <DateTimePicker onChange={this.onChangeDateStart} value={this.state.dateStart} />
      </div>
      <select name="chartType" id="chartType" onChange={this.onChangeChartType} value={this.state.chartType} >
        <option value="max">maksimum</option>
        <option value="avg">średnia</option>
        <option value="min">minimum</option>
      </select>
      <select name="chartValue" id="chartValue" onChange={this.onChangeChartValue} value={this.state.chartValue} >
        <option value="temp">Temperatura</option>
        <option value="humidity">Wilgotność</option>
        <option value="pressure">Ciśnienie powietrza</option>
        <option value="pm25">PM2.5</option>
        <option value="pm10">PM10</option>
        <option value="pm25Corr">PM2.5 z korekcją</option>
      </select>
      <div>
      <DateTimePicker onChange={this.onChangeDateEnd} value={this.state.dateEnd} />
      </div>
      <div id="dateButtons">
        <button onClick={()=>this.handleDateButton("this month")}>Obecny miesiąc</button>
        <button onClick={()=>this.handleDateButton("this week")}>Obecny tydzień</button>
        <button onClick={()=>this.handleDateButton("yesterday")}>Wczoraj</button>
        <button onClick={()=>this.handleDateButton("today")}>Dzisiaj</button>
      </div>
      <div>
      <AreaChart
          width={this.state.chartWidth}
          height={300}
          data={this.state.measuresList}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
    </linearGradient>
    </defs>
          <XAxis dataKey="date" fontSize="12"/>
          {this.state.chartValue==="pressure" ?
           <><YAxis domain={['auto', 'auto']} unit={this.state.chartYAxisUnit} fontSize="10" width={40}/>
           </> 
           : 
           <><YAxis unit={this.state.chartYAxisUnit} fontSize="10" width={40}/>
           </>}
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value, name) => value + this.state.chartYAxisUnit}/>
          <Legend />
          <Area name={legend[this.state.chartValue]} type="monotone" dataKey={this.state.chartValue} stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
      </div>
      <div>
      
        <LineChart
          width={this.state.chartWidth}
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
          <XAxis dataKey="date" fontSize="12"/>
          {this.state.chartValue==="pressure" ?
           <><YAxis domain={['auto', 'auto']} unit={this.state.chartYAxisUnit} fontSize="10" width={40}/>
           </> 
           : 
           <><YAxis unit={this.state.chartYAxisUnit} fontSize="10" width={40}/>
           </>}
           <Tooltip formatter={(value, name) => value + this.state.chartYAxisUnit}/>
          <Legend />
          <Line name={legend[this.state.chartValue]} type="monotone" dataKey={this.state.chartValue} stroke="#8884d8" activeDot={{ r: 4 }} />
        </LineChart>
      </div>
      </>
    );
  }
}