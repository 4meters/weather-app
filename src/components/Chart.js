import React, { PureComponent, useState } from 'react';
import { LineChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import DateTimePicker from 'react-datetime-picker';

import {format, differenceInHours, startOfMonth,
  startOfWeek, startOfDay, endOfDay, sub, isThisSecond} from 'date-fns';

import {DefaultTooltipContent} from 'recharts/lib/component/DefaultTooltipContent';



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
      chartWidth: 700,
      screenWidth: window.innerWidth
      //isLoading: "true"
    };
  }
  
  

  static URL="192.168.1.202"

  static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';

  componentDidMount() {
    console.log("stationId: "+this.props.stationId)
    const updateDimensions = () => {
      this.setState({screenWidth: window.innerWidth})
      this.setChartWidth();
    }
    window.addEventListener('resize', updateDimensions)
    this.setChartWidth();
    console.log(window.innerWidth)
    this.getMeasureList();
    console.log(this.state.measuresList)
    //console.log(data2)
    //useEffect[dateStart]
    //useEffect[dateEnd]
  }
  
  //TODO Remove
  componentDidUpdate(prevProps, prevState) {
    if (prevState.screenWidth !== this.state.screenWidth) {
      console.log('pokemons state has changed.')
    }
  }
  
  
  //callbacks on state change
  setChartWidth(){
    let width = window.innerWidth;
    if(width < 700){
      this.setState({chartWidth: width})
    }
    else{
      this.setState({chartWidth: 700})
    }
  }


  checkDateDiff = (date, startOrEndDate) =>{
    if(startOrEndDate==="end"){
      let diffHours=differenceInHours(this.state.dateStart, date);
      console.log(diffHours);
      if(diffHours<=-1){
        return true;
      }
      else{
        return false;
      }
    }
    else if(startOrEndDate==="start"){
      let diffHours=differenceInHours(date, this.state.dateEnd);
      //console.log(diffHours);if start<end -> -diff
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
    this.getMeasureList();
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
      this.getMeasureList();
    }
    else{
      alert("Minimum allowed date range is 1 hour. Please set another time")
    }
  }

  onChangeDateEnd = (date) =>{
    if(this.checkDateDiff(date, "end")){
      this.setState({
        dateEnd: date
      }, this.getMeasureList);
      this.getMeasureList();
    }
    else{
      alert("Minimum allowed date range is 1 hour. Please set another time")
    }
    
  }

  onChangeChartType = (event) =>{
    console.log(event.target.value)
    this.setState({
      chartType: event.target.value
    },this.getMeasureList);
    //this.setState({isLoading: true})
    this.getMeasureList();
  }
  
  onChangeChartValue = (event) =>{
    //this.setState({
    //  isLoading: true
    //})
    let unitYAxisMapper={"temp": "°C",
                        "humidity": "%",
                        "pressure": "hPa",
                        "pm25": "µg/m³",
                        "pm25Corr": "µg/m³",
                        "pm10": "µg/m³"}
    //console.log(event.target.value)
    this.setState({
      chartYAxisUnit: unitYAxisMapper[event.target.value]
    })
    this.setState({
      chartValue: event.target.value,
    },this.getMeasureList);
    //this.setState({isLoading: true})
    this.getMeasureList();
  }

  getMeasureList = () => {
      const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "apiKey" : "DH1_D3JJ9WCWBLIFYBSWN5T68GSM7W_C",
          "stationId": this.state.stationId,
          "dateFrom" : this.state.dateStart.toISOString(),
          "dateTo" : this.state.dateEnd.toISOString(),
          "timezone": format(new Date, 'xxx'),
          "chartType": this.state.chartType,
          "chartValue": this.state.chartValue
      })
      };
 
      fetch(`http://192.168.1.202:8080/api/measure/measure-by-date-chart`, requestParams)
          .then(res => res.json())
          .then(measuresList => {
              measuresList=measuresList['chartDtoList'];
              this.setState({
                ...this.state,
                measuresList
            });
            //this.setState({isLoading: false})
            //console.log(measuresList);
          })
  }


  render() {
    return (
      
      <>
      <div>
      <DateTimePicker onChange={this.onChangeDateStart} value={this.state.dateStart} />
      </div>
      <select name="chartType" id="chartType" onChange={this.onChangeChartType} value={this.state.chartType} >
        <option value="max">max</option>
        <option value="avg">avg</option>
        <option value="min">min</option>
      </select>
      <select name="chartValue" id="chartValue" onChange={this.onChangeChartValue} value={this.state.chartValue} >
        <option value="temp">Temperature</option>
        <option value="humidity">Humidity</option>
        <option value="pressure">Pressure</option>
        <option value="pm10">PM10</option>
        <option value="pm25">PM25</option>
        <option value="pm25Corr">PM25 Corrected</option>
      </select>
      <div>
      <DateTimePicker onChange={this.onChangeDateEnd} value={this.state.dateEnd} />
      </div>
      <div id="dateButtons">
        <button onClick={()=>this.handleDateButton("this month")}>This month</button>
        <button onClick={()=>this.handleDateButton("this week")}>This week</button>
        <button onClick={()=>this.handleDateButton("yesterday")}>Yesterday</button>
        <button onClick={()=>this.handleDateButton("today")}>Today</button>
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
          <Area type="monotone" dataKey={this.state.chartValue} stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
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
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={this.state.chartValue} stroke="#8884d8" activeDot={{ r: 4 }} />
        </LineChart>
      </div>
      </>
    );
  }
}