import React, { useState, useEffect } from "react";
import {MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import {DomEvent, Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
//import 'SideNavigation.js'
import L from 'leaflet';
import Chart from './Chart';

import {Link} from "react-router-dom";
import {NavLink} from "react-router-dom";

import NavList from "./NavList";

//import { useLocation } from 'react-router-dom';
import {useLocation,useNavigate,useParams} from "react-router-dom";

import { Navigate } from "react-router-dom";

import {format} from 'date-fns';

import { WiThermometer, WiBarometer, WiHumidity, WiTime9, } from "react-icons/wi";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const mapStyle = { height: "90vh" };

let position = [50.068, 21.255]

let activeStyle = {
  textDecoration: "underline"
};

let activeClassName = "underline"

function Map(props){

  const [stateStationList,setStateStationList] = useState();
  const [stateMarkers,setStateMarkers] = useState([]);
  const [statePrivateMarkers,setStatePrivateMarkers] = useState([]);

  const [stateStationLastMeasure,setStateStationLastMeasure] = useState([]);
  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);

  const [stateIsLoading, setStateIsLoading] = useState(true);

  const navigate = useNavigate();

  let REFRESH_TIME = 1000 * 60 * 5; //=5min
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  useEffect(()=>{
    let token=localStorage.getItem('token');
    if(typeof(token)==="string"){
      if(token.length>0){
        setStateToken(localStorage.getItem('token'));
        setStateIsLoggedIn(true);
      }
      else{
        setStateIsLoggedIn(false);
      }
    }
    else{
      setStateIsLoggedIn(false);
      }
    console.log("Logged in:"+stateIsLoggedIn)
    //weatherData();
    refreshMarkers();
    const updateTimer = setInterval(() => refreshMarkers(), REFRESH_TIME);
    

  }, [])

  useEffect(()=>{
    if(stateIsLoggedIn){
      console.log("DDD")
      refreshPrivateMarkers();
    }
    else{
      setStateIsLoading(false);
    }
  },[stateIsLoggedIn])

  useEffect(()=>{
    console.log("UE4")
    console.log(stateMarkers)
    console.log("UE5")
    console.log(statePrivateMarkers)
    deDuplicateStations();
  })

  useEffect(()=>{
    console.log("My station list: "+statePrivateMarkers);
    console.log("station list: "+stateMarkers);
    //deDuplicateStations();
  },[statePrivateMarkers, stateMarkers, stateIsLoggedIn])

  useEffect(()=>{

  },[stateIsLoading])



  const deDuplicateStations = () => {
    console.log("XDDD")
    let sizeMarkers = stateMarkers.length;
    let sizePrivateMarkers= statePrivateMarkers.length;
    for(let i=0; i<sizePrivateMarkers; i++){
      for(let j=0; j<sizeMarkers; j++){
        console.log("SHSHE")
        //console.log("MOSTIMP: "+stateMarkers[i])
        //console.log("MOSTIMP2: "+statePrivateMarkers[j])
        if(stateMarkers[j]!=undefined && statePrivateMarkers[j]!=undefined){
        if(stateMarkers[j][2]===statePrivateMarkers[i][2]){
          console.log("MOSTIMP: "+stateMarkers[j])
          console.log("MOSTIMP2: "+statePrivateMarkers[i])
          console.log("SUCCCESAS")
          //let copy=stateMarkers;
          //const index = copy.indexOf(marker);
          //console.log(index)
          //if (index > -1) {
            console.log("SUPERSCCUSE")
            let markersList = stateMarkers;
            markersList.splice(j, 1);
            console.log("MEGSAIMP"+markersList);
            setStateMarkers(markersList)
            setStateIsLoading(false);
          
        }}
      }
    }
  }

  const refreshMarkers = () => {
      fetch(`http://127.0.0.1:8080/api/station/get-public-stationlist`)
          .then(res => res.json())
          .then(stationList => {
            let stateStationList=stationList;//fix for access in second fetch
            setStateStationList(stationList);
            fetch(`http://127.0.0.1:8080/api/measure/last-measure-all`)
            .then(res => res.json())
            .then(response => {
  
              let markers = [];
              let measureList=response['measureList'];
              setStateStationLastMeasure(response['measureList']);
              console.log(stateStationLastMeasure);
              console.log(stateStationList);
  
  
              let size = stateStationList['stationList'].length;
              for(var i = 0; i < size ; i++){
                let item = stateStationList['stationList'][i];
                var markerPosition=[item['lat'], item['lng'], item['stationId'], measureList[item['stationId']], item['stationName']];
                markers.push(markerPosition);
              }
              console.log(stateStationList);
              console.log(markers);
              //setStateStationList(stationList);
              setStateMarkers(markers);
              console.log(response)
          })
          
                  
      });
                
              
          
  }
  
  
  const refreshPrivateMarkers = () =>{
    fetch(`http://127.0.0.1:8080/api/user/get-user-mystationlist-details/`+stateToken)
    .then(res => res.json())
    .then(response => {
      console.log(response)
      console.log(response['value'])
      let stationList=response['stationList']
      let measureList=response['measureList']

      let privateMarkers = [];

      let size = stationList.length;
      for(var i = 0; i < size ; i++){
        let item = stationList[i];
        var markerPosition=[item['lat'], item['lng'], item['stationId'], measureList[item['stationId']], item['stationName']];
        privateMarkers.push(markerPosition);
      }
      setStatePrivateMarkers(privateMarkers);
      //deDuplicateStations();
    })
    /*.then([httpcode, response] => {
      if(res['status']==200){
        let response = res.json();
        console.log(response)
        console.log(response['value'])
        let stationList=response['stationList']
        let measureList=response['measureList']

        let privateMarkers = [];

        let size = stationList.length;
        for(var i = 0; i < size ; i++){
          let item = stationList['stationList'][i];
          var markerPosition=[item['lat'], item['lng'], item['stationId'], measureList[item['stationId']], item['stationName']];
          privateMarkers.push(markerPosition);
        }
        setStatePrivateMarkers(privateMarkers); 
      }
    })*/
      
  }

  const weatherData = function(){
    fetch(`http://127.0.0.1:8080/api/measure/last-measure-all`)
          .then(res => res.json())
          .then(response => {
            console.log(response)
              let measureList=response['measureList'];
              setStateStationLastMeasure(response['measureList']);
              console.log(stateStationLastMeasure);
            });
            
          }
          
   


  const renderItem = ({position}) => {
    return (
      <Marker position={position}><Popup>
      <p>Test</p>
      </Popup>
      </Marker>
    )
}
  //TODO merge measures into markers //TODO conditional rendering --no measures
/*const markersList = stateMarkers.map((data) => {
  return (
    <Marker position={[data[0], data[1]]}>
           <Popup>
             <p>Station id: {data[2]} </p>
             {typeof(data[3])!="undefined" ? <> 
             <p><b>Temp: </b>{data[3]['temp']}</p>
             <p><b>Humidity: </b>{data[3]['humidity']}</p>
             <p><b>Pressure: </b>{data[3]['pressure']}</p>
             <p><b>pm25: </b>{data[3]['pm25']}</p>
             <p><b>pm25corr: </b>{data[3]['pm25Corr']}</p>
             <p><b>pm10: </b>{data[3]['pm10']}</p>
             <p><b>Measure time: </b>{data[3]['date']}</p>
             <div id="stats">
               <Chart></Chart>
             </div>
             </> : <></>
             }
           </Popup>
         </Marker>
  )*/

  const handleButtonClick = (event) =>{
    navigate("/statistics?stationId="+event.target.value)
    //add station id to path
  }

  const greenMarker = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const markersList = (markers) =>{

    return (markers.map((data, idx) => {
      
      return (
        <Marker key={`marker-${idx}`} position={[data[0], data[1]]}>
               <Popup>
                 <h3>{data[4]}</h3>
                 <p>{data[2]} </p>
                 {typeof(data[3])!="undefined" ? <> 
                 <p><WiThermometer size={36}/>{data[3]['temp']}°C</p>
                 <p><WiHumidity size={36}/>{data[3]['humidity']}%</p>
                 <p><WiBarometer size={36}/>{data[3]['pressure']}hPa</p>
                 <p><b>pm25: </b>{data[3]['pm25']}µg/m³</p>
                 <p><b>pm25corr: </b>{data[3]['pm25Corr']}µg/m³</p>
                 <p><b>pm10: </b>{data[3]['pm10']}µg/m³</p>
                 <p><WiTime9 size={36}/>{format(Date.parse(data[3]['date']), 'yyyy.MM.dd HH:mm')}</p>
                 <div id="stats">
                   <button value={data[2]} onClick={handleButtonClick}>Archival data</button>
                 </div>
                 </> : <></>
                 }
               </Popup>
             </Marker>
             
      )
    }))
  }

  const privateMarkersList = (markers) =>{

    return (markers.map((data, idx) => {
      
      return (
        <Marker key={`marker-${idx}`} position={[data[0], data[1]]}  icon={greenMarker}>
               <Popup>
                 <h3>{data[4]}</h3>
                 <p>{data[2]}  My station</p>
                 {typeof(data[3])!="undefined" ? <> 
                 <p><WiThermometer/>{data[3]['temp']}°C</p>
                 <p><b>Humidity: </b>{data[3]['humidity']}%</p>
                 <p><b>Pressure: </b>{data[3]['pressure']}hPa</p>
                 <p><b>pm25: </b>{data[3]['pm25']}µg/m³</p>
                 <p><b>pm25corr: </b>{data[3]['pm25Corr']}µg/m³</p>
                 <p><b>pm10: </b>{data[3]['pm10']}µg/m³</p>
                 <p><b>Measure time: </b>{format(Date.parse(data[3]['date']), 'yyyy.MM.dd HH:mm')}</p>
                 <div id="stats">
                   <button value={data[2]} onClick={handleButtonClick}>Archival data</button>
                 </div>
                 </> : <></>
                 }
               </Popup>
             </Marker>
      )
    }))
  }
/*
  <p><b>Temp: </b>{stateStationLastMeasure[data[2]]['temp']}</p>
             <p><b>Humidity: </b>{stateStationLastMeasure[data[2]]['humidity']}</p>
             <p><b>Pressure: </b>{stateStationLastMeasure[data[2]]['pressure']}</p>
             <p><b>pm25: </b>{stateStationLastMeasure[data[2]]['pm25']}</p>
             <p><b>pm25corr: </b>{stateStationLastMeasure[data[2]]['pm25Corr']}</p>
             <p><b>pm10: </b>{stateStationLastMeasure[data[2]]['pm10']}</p>
             <p><b>Measure time: </b>{stateStationLastMeasure[data[2]]['date']}</p>
*/
//<button onClick={showStatistics}>Statistics</button>


  
//TODO conditional navigation render
  return (
    <>
    <div style={{display: "flex", flexDirection: "column"}}>
    <div style={{display: "flex", flex:1}}>
    <NavList/>
    <div>
      
    </div>
    </div>
      <div className="d-flex p-2 col-example">
        <MapContainer key={stateIsLoading} center={position} zoom={12} style={mapStyle} maxZoom={18} zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {stateIsLoading ? <></> :
        <>{markersList(stateMarkers)}
        {privateMarkersList(statePrivateMarkers)}</>}
        
        <ZoomControl position="bottomright"/>
      </MapContainer>
      </div>
      </div>
    </>
  )//RENDER ISSUES !!
  // /{markersList(stateMarkers)} //above privatemarkers //markery się dublują jeśli są na dwóch listach, add check
}

export default Map;