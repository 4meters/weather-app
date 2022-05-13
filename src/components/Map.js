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

import {format, max} from 'date-fns';

import { WiThermometer, WiBarometer, WiHumidity, WiTime9, } from "react-icons/wi";
import {BsBookmarkDashFill, BsBookmarkPlus} from "react-icons/bs";

import Flex from '@react-css/flex'


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

  const [stateMyStationList,setStateMyStationList] = useState([]);
  const [stateBookmarkStationList,setStateBookmarkStationList] = useState([]);

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
      getUserStationList();
    }
    else{
      setStateIsLoading(false);
    }
  },[stateIsLoggedIn])

  useEffect(()=>{
    console.log("Bookmark")
    console.log(stateBookmarkStationList);
  },[stateBookmarkStationList])

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
    console.log("Deduplicate start")
    let sizeMarkers = stateMarkers.length;
    let sizePrivateMarkers= statePrivateMarkers.length;
    for(let i=0; i<sizePrivateMarkers; i++){
      for(let j=0; j<sizeMarkers; j++){
        console.log("Entered second loop")
        //console.log("MOSTIMP: "+stateMarkers[i])
        //console.log("MOSTIMP2: "+statePrivateMarkers[j])
        if(stateMarkers[j]!=undefined && statePrivateMarkers[j]!=undefined){
        if(stateMarkers[j][2]===statePrivateMarkers[i][2]){
          console.log("StateMarkers: "+stateMarkers[j])
          console.log("StatePrivateMarkers: "+statePrivateMarkers[i])
          console.log("SUCCESS")
          //let copy=stateMarkers;
          //const index = copy.indexOf(marker);
          //console.log(index)
          //if (index > -1) {
            console.log("SUPERSCCUSE")
            let markersList = stateMarkers;
            markersList.splice(j, 1);
            console.log("MarkerList00"+markersList);
            setStateMarkers(markersList)
            setStateIsLoading(false);
          
        }}
      }
    }
  }

  const getAirQualityIndexOverall = (pm25,pm10) =>{//pm2.5 pm10
    return Math.max(getAirQualityIndexPM25(pm25), getAirQualityIndexPM10(pm10));
  }

  const getAirQualityIndexPM25 = (pm25) =>{
    if(pm25<=13){
      return 0;
    }
    else if(pm25>13.1 && pm25<=35){
      return 1;
    }else if(pm25>35.1 && pm25<=55){
      return 2;
    }else if(pm25>55.1 && pm25<=75){
      return 3;
    }else if(pm25>75.1 && pm25<=110){
      return 4;
    }else if(pm25>110){
      return 5;
    }
  }

  const getAirQualityIndexPM10 = (pm10) =>{//pm2.5 pm10
    if(pm10<=20){
      return 0;
    }
    else if(pm10>20 && pm10<=50){
      return 1;
    }else if(pm10>>50.1 && pm10<=80){
      return 2;
    }else if(pm10>80.1 && pm10<=110){
      return 3;
    }else if(pm10>110.1 && pm10<=150){
      return 4;
    }else if(pm10>150){
      return 5;
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


  const getUserStationList = event => {
    //TODO add status check
    //TODO empty list catch
    fetch(`http://127.0.0.1:8080/api/user/get-user-stationlist/`+stateToken)
        .then(res => res.json())
        .then(response => {
            setStateMyStationList(response['myStationList'])
            setStateBookmarkStationList(response['bookmarkStationList'])
            //console.log(response)
        })
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
          
  const bookmarkRequest=(stationId, operation)=>{
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "stationId" : stationId
    })
    };
    fetch(`http://127.0.0.1:8080/api/user/`+operation+`-bookmark`,requestParams)
    .then(response => {
      if(response.status===200){
        refreshMarkers();
        refreshPrivateMarkers();
        getUserStationList();
      }
    })

  }


  const renderItem = ({position}) => {
    return (
      <Marker position={position}><Popup>
      <p>Test</p>
      </Popup>
      </Marker>
    )
}
  const airQualityInfo=(level)=>{
    switch(level){
      case 0:{
        return(
          <div style={{backgroundColor: "rgb(0, 153, 0)"}}><h3 style={{color: "#FFFFFF"}}>Bardzo dobry</h3></div>
        )
      }
      case 1:{
        return(
        <div style={{backgroundColor: "rgb(153, 255, 51)"}}><h3>Dobry</h3></div>
        )
      }
      case 2:{
        return(
          <div style={{backgroundColor: "rgb(255, 255, 0)"}}><h3>Umiarkowany</h3></div>
        )
      }
      case 3:{
        return(
          <div style={{backgroundColor: "rgb(255, 102, 0)"}}><h3 style={{color: "#FFFFFF"}}>Dostateczny</h3></div>
        )
      }
      case 4:{
        return(
          <div style={{backgroundColor: "rgb(255, 0, 0)"}}><h3 style={{color: "#FFFFFF"}}>Zły</h3></div>
        )
      }
      case 5:{
        return(
          <div style={{backgroundColor: "rgb(153, 0, 0)"}}><h3 style={{color: "#FFFFFF"}}>Bardzo zły</h3></div>
        )
      }
    }
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

  const handleArchivalDataButtonClick = (event) =>{
    navigate("/archival-data?stationId="+event.target.value)
    //add station id to path
  }

  const checkBookmark = (stationId) =>{
    for(let i=0;i<stateBookmarkStationList.length;i++){
      let item=stateBookmarkStationList[i];
      if(item['stationId']===stationId){
        return true;
      }
    }
    return false;
  }

  const handleBookmarkButtonClick = (stationId,operation) =>{
    if(operation==="add"){
      bookmarkRequest(stationId, operation)
    }
    else if(operation==="remove"){
      bookmarkRequest(stationId, operation)
    }
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
                 <h3>{data[4]}{stateIsLoggedIn ? 
                 <>
                 {checkBookmark(data[2])?
                  <><button value={data[2]} onClick={() => handleBookmarkButtonClick(data[2],"remove")}><BsBookmarkDashFill/></button>
                  </> 
                  : <><button value={data[2]} onClick={() => handleBookmarkButtonClick(data[2],"add")}><BsBookmarkPlus/></button>
                  </>}
                  
                 </> : <></>}</h3>

                 <p style={{fontSize: "10px", marginTop: "-10px"}}>id: {data[2]} </p>
                 
                 
                 {typeof(data[3])!="undefined" ? <> 
                 <Flex style={{marginTop: "-10px", marginBottom: "-10px"}}>
                 <div><WiThermometer size={24}/>{data[3]['temp']}°C</div>
                 <div><WiHumidity size={24}/>{data[3]['humidity']}%</div>
                 <div><WiBarometer size={24}/>{data[3]['pressure']}hPa</div>
                 </Flex>
                 <p><b>PM2.5: </b>{data[3]['pm25']}µg/m³ {Math.round(parseFloat(data[3]['pm25'])/25*100)}%</p>
                 <p style={{fontSize: "8px", marginTop: "-10px", marginBottom:"-10px"}}>Indeks</p>
                 {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25']))}
                 
                 <p><b>PM2.5 z korekcją: </b>{data[3]['pm25Corr']}µg/m³ {Math.round(parseFloat(data[3]['pm25Corr'])/25*100)}%</p>
                 <p style={{fontSize: "8px", marginTop: "-10px", marginBottom:"-10px"}}>Indeks</p>
                 {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25Corr']))}
                 
                 <p><b>PM10: </b>{data[3]['pm10']}µg/m³ {Math.round(parseFloat(data[3]['pm10'])/50*100)}%</p>
                 <p style={{fontSize: "8px", marginTop: "-10px", marginBottom:"-10px"}}>Indeks</p>
                 {airQualityInfo(getAirQualityIndexPM10(data[3]['pm10']))}
                 
                 <p><WiTime9 size={24}/>{format(Date.parse(data[3]['date']), 'yyyy.MM.dd HH:mm')}</p>
                 <div id="stats">
                   <button value={data[2]} onClick={handleArchivalDataButtonClick}>Dane archiwalne</button>
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

                 <p style={{fontSize: "10px", marginTop: "-10px"}}>id: {data[2]} </p>
                 
                 
                 {typeof(data[3])!="undefined" ? <> 
                 <Flex style={{marginTop: "-10px", marginBottom: "-10px"}}>
                 <div><WiThermometer size={24}/>{data[3]['temp']}°C</div>
                 <div><WiHumidity size={24}/>{data[3]['humidity']}%</div>
                 <div><WiBarometer size={24}/>{data[3]['pressure']}hPa</div>
                 </Flex>
                 <p><b>PM2.5: </b>{data[3]['pm25']}µg/m³ {Math.round(parseFloat(data[3]['pm25'])/25*100)}%</p>
                 <p style={{fontSize: "8px", marginTop: "-10px", marginBottom:"-10px"}}>Indeks</p>
                 {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25']))}
                 
                 <p><b>PM2.5 z korekcją: </b>{data[3]['pm25Corr']}µg/m³ {Math.round(parseFloat(data[3]['pm25Corr'])/25*100)}%</p>
                 <p style={{fontSize: "8px", marginTop: "-10px", marginBottom:"-10px"}}>Indeks</p>
                 {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25Corr']))}
                 
                 <p><b>PM10: </b>{data[3]['pm10']}µg/m³ {Math.round(parseFloat(data[3]['pm10'])/50*100)}%</p>
                 <p style={{fontSize: "8px", marginTop: "-10px", marginBottom:"-10px"}}>Indeks</p>
                 {airQualityInfo(getAirQualityIndexPM10(data[3]['pm10']))}
                 
                 <p><WiTime9 size={24}/>{format(Date.parse(data[3]['date']), 'yyyy.MM.dd HH:mm')}</p>
                 <div id="stats">
                   <button value={data[2]} onClick={handleArchivalDataButtonClick}>Dane archiwalne</button>
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
        <MapContainer key={stateIsLoading} center={position} zoom={10} style={mapStyle} maxZoom={18} zoomControl={false}>
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