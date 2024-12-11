import React, { useState, useEffect } from "react";
import {MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";

import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

import L from 'leaflet';

import { useRef } from "react";

import {useNavigate,useSearchParams} from "react-router-dom";


import {format} from 'date-fns';

import { WiThermometer, WiBarometer, WiHumidity, WiTime9, } from "react-icons/wi";
import {BsBookmarkDashFill, BsBookmarkPlus} from "react-icons/bs";

import Flex from '@react-css/flex'

import SideMenu from "./nav/SideMenu";
import {Button} from "react-bootstrap";
import * as mapApi from "../API/MapAPI"

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const mapStyle = { height: "90vh" };


let position = [50.068, 21.255]


function Map(props){
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [stateShowMarker,setStateShowMarker] = useState("")
  const [stateStationList,setStateStationList] = useState();
  const [stateMarkers,setStateMarkers] = useState([]);
  const [statePrivateMarkers,setStatePrivateMarkers] = useState([]);
  const [stateBookmarkMarkers,setStateBookmarkMarkers] = useState([]);

  const [stateStationLastMeasure,setStateStationLastMeasure] = useState([]);
  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);

  const [stateIsLoading, setStateIsLoading] = useState(true);

  const [stateMyStationList,setStateMyStationList] = useState([]);
  const [stateBookmarkStationList,setStateBookmarkStationList] = useState([]);


  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();


  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  let REFRESH_TIME = 1000 * 60 * 5; //=5min

  useEffect(()=>{
    let token=localStorage.getItem('token');
    setStateShowMarker(searchParams.get('stationId'));
    showMarker();

    if(typeof(token)==="string"){
      if(token.length>0){
        setStateToken(localStorage.getItem('token'));
        setStateIsLoggedIn(true);
        const updateTimer = setInterval(() => {refreshPrivateMarkers();
           refreshBookmarkMarkers()}, REFRESH_TIME); //refresh every 5min
      }
      else{
        setStateIsLoggedIn(false);
      }
    }
    else{
      setStateIsLoggedIn(false);
      }
    console.log("Logged in:"+stateIsLoggedIn)
    refreshMarkers();
    const updateTimer = setInterval(() => refreshMarkers(), REFRESH_TIME);      //refresh every 5min
  
  }, [])

  useEffect(()=>{
    if(stateIsLoggedIn){
      refreshPrivateMarkers();
      refreshBookmarkMarkers();
      getUserStationList();
    }
    else{
      setStateIsLoading(false);
    }
  },[stateIsLoggedIn])



  useEffect(()=>{
    console.log("My station list: "+statePrivateMarkers);
    console.log("station list: "+stateMarkers);
    //deDuplicateStations();
  },[statePrivateMarkers, stateMarkers, stateIsLoggedIn])



  const showMarker = async() => {
    await sleep(2500) //wait for setting react state...
    const map = mapRef.current;
    if (!map) {
      return;
    }

    //map.flyTo([50.0,20.0], 13);

    const marker = markerRef.current;
    if (marker) {
      let latlng=marker['_latlng']
      console.log(latlng)

      map.flyTo(latlng);
      console.log(marker)

      await sleep(700)
      marker.openPopup();
    }
  };

  const deDuplicateStations = () => {
    console.log("Deduplicate start")
    let sizeMarkers = stateMarkers.length;
    let sizePrivateMarkers= statePrivateMarkers.length;
    let sizeBookmarkMarkers= stateBookmarkMarkers.length;

    let markersList = stateMarkers;

    for(let i=0; i<sizePrivateMarkers; i++){
      for(let j=0; j<sizeMarkers; j++){
        if(stateMarkers[j]!==undefined && statePrivateMarkers[i]!==undefined){
        if(stateMarkers[j][2]===statePrivateMarkers[i][2]){
          let markersList = stateMarkers;
          markersList.splice(j, 1);
          setStateMarkers(markersList);
        }}
      }
    }

    for(let i=0; i<sizeBookmarkMarkers; i++){
      for(let j=0; j<sizeMarkers; j++){
        if(stateMarkers[j]!==undefined && stateBookmarkMarkers[i]!==undefined){
        if(stateMarkers[j][2]===stateBookmarkMarkers[i][2]){
          let markersList = stateMarkers;
          markersList.splice(j, 1);
          
          setStateMarkers(markersList)
        }}
      }
    }

    console.log("Markerlist after deduplicate: "+markersList);
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
    }else if(pm10>50.1 && pm10<=80){
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
    mapApi.fetchMarkers((response) => {
      let stateStationList = response;
      setStateStationList(response);
      mapApi.fetchLastMeasures((response)=>{
        let markers = [];
        let measureList = response['measureList'];
        setStateStationLastMeasure(response['measureList']);
        //console.log(stateStationLastMeasure);
        //console.log(stateStationList);


        let size = stateStationList['stationList'].length;
        for (let i = 0; i < size; i++) {
          let item = stateStationList['stationList'][i];
          let markerPosition = [item['lat'], item['lng'], item['stationId'], measureList[item['stationId']], item['stationName']];
          markers.push(markerPosition);
        }
        //console.log(stateStationList);
        //console.log(markers);
        //setStateStationList(stationList);
        setStateMarkers(markers);
        //console.log(response)
      })
    })
  }


  const refreshPrivateMarkers = () => {
    mapApi.fetchPrivateMarkers(stateToken, (response) => {
      let stationList = response['stationList']
      let measureList = response['measureList']

      let privateMarkers = [];

      let size = stationList.length;
      for (var i = 0; i < size; i++) {
        let item = stationList[i];
        var markerPosition = [item['lat'], item['lng'], item['stationId'], measureList[item['stationId']], item['stationName']];
        privateMarkers.push(markerPosition);
      }
      setStatePrivateMarkers(privateMarkers);
    })
  }

  const refreshBookmarkMarkers = () => {
    mapApi.fetchBookmarkMarkers(stateToken, (response) => {
      let stationList = response['stationList']
      let measureList = response['measureList']

      let bookmarkMarkers = [];

      let size = stationList.length;
      for (var i = 0; i < size; i++) {
        let item = stationList[i];
        var markerPosition = [item['lat'], item['lng'], item['stationId'], measureList[item['stationId']], item['stationName']];
        bookmarkMarkers.push(markerPosition);
      }
      setStateBookmarkMarkers(bookmarkMarkers);
    })
  }


  const getUserStationList = () => {
    mapApi.fetchUserStationList(stateToken, (response) => {
      setStateMyStationList(response['myStationList'])
      setStateBookmarkStationList(response['bookmarkStationList'])
    })
  }
          
  const bookmarkRequest=(stationId, operation)=>{
    mapApi.bookmarkRequest(stateToken, stationId, operation, (response)=>{
      if(response.status===200){
        refreshMarkers();
        refreshPrivateMarkers();
        refreshBookmarkMarkers();
        getUserStationList();
      }
    })
  }


  const airQualityInfo=(level)=>{
    switch(level){
      case 0:{
        return(
          <div style={{backgroundColor: "rgb(0, 153, 0)"}}><h6 style={{color: "#FFFFFF"}}>Bardzo dobry</h6></div>
        )
      }
      case 1:{
        return(
        <div style={{backgroundColor: "rgb(153, 255, 51)"}}><h6>Dobry</h6></div>
        )
      }
      case 2:{
        return(
          <div style={{backgroundColor: "rgb(255, 255, 0)"}}><h6>Umiarkowany</h6></div>
        )
      }
      case 3:{
        return(
          <div style={{backgroundColor: "rgb(255, 102, 0)"}}><h6 style={{color: "#FFFFFF"}}>Dostateczny</h6></div>
        )
      }
      case 4:{
        return(
          <div style={{backgroundColor: "rgb(255, 0, 0)"}}><h6 style={{color: "#FFFFFF"}}>Zły</h6></div>
        )
      }
      case 5:{
        return(
          <div style={{backgroundColor: "rgb(153, 0, 0)"}}><h6 style={{color: "#FFFFFF"}}>Bardzo zły</h6></div>
        )
      }
    }
  }


  const handleArchivalDataButtonClick = (event) =>{
    navigate("/archival-data?stationId="+event.target.value)
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

  const goldMarker = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const pStyle1={marginTop:"5px",marginLeft:"-5px"};

  const flexStyle1={marginTop: "-8px", marginBottom: "-25px", marginLeft: "-8px"}
  const flexStyle2={marginTop: "-10px", marginBottom: "-20px"}

  const renderMarkersList = (markers) =>{
    deDuplicateStations();
    return (markers.map((data, idx) => {
      //show marker
      let ref1;

      if(stateShowMarker!=="" && stateShowMarker===data[2]){
        ref1=markerRef;
        console.log("Found marker!")
      }
      else{
        ref1=null;
      }
      if(data[0] && data[1]) {
        return (
            <Marker ref={ref1} key={`marker-${idx}`} position={[data[0], data[1]]}>
              <Popup>
                <Flex justifySpaceBetween style={{marginTop: "-4px", paddingRight: "10px"}}>
                  <h5 style={{marginBottom: "10px"}}>{data[4]}</h5>
                  {stateIsLoggedIn ?
                      <>
                        {checkBookmark(data[2]) ?
                            <div>
                              <Button size="sm" variant="secondary" className="no-padding" value={data[2]} onClick={() => handleBookmarkButtonClick(data[2], "remove")}>
                                <BsBookmarkDashFill/></Button>
                            </div>
                            : <div>
                              <Button size="sm" variant="secondary" className="no-padding" value={data[2]} onClick={() => handleBookmarkButtonClick(data[2], "add")}>
                                <BsBookmarkPlus/></Button>
                            </div>}

                      </> : <></>}
                </Flex>

                <p style={{fontSize: "10px", marginTop: "-10px"}}>id: {data[2]} </p>


                {typeof (data[3]) != "undefined" ? <>
                  <Flex style={flexStyle1}>
                    <WiThermometer size={24}/><p style={pStyle1}>{data[3]['temp']}°C</p>
                    <WiHumidity size={24}/><p style={pStyle1}>{data[3]['humidity']}%</p>
                    <WiBarometer size={24}/><p style={pStyle1}>{data[3]['pressure']}hPa</p>
                  </Flex>
                  {data[3]['pm25'] ?
                      <><Flex style={flexStyle2} justifySpaceBetween><p><b>PM2.5: </b></p>
                        <p>{data[3]['pm25']}µg/m³ {Math.round(parseFloat(data[3]['pm25']) / 25 * 100)}%</p></Flex>
                        <p style={{fontSize: "8px", marginTop: "2px", marginBottom: "0px"}}>Indeks</p>
                        {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25']))}</>
                      : null}

                  {data[3]['pm25Corr'] ?
                      <><Flex style={flexStyle2} justifySpaceBetween><p style={{marginRight: "3px"}}><b>PM2.5 z
                        korekcją: </b></p>
                        <p>{data[3]['pm25Corr']}µg/m³ {Math.round(parseFloat(data[3]['pm25Corr']) / 25 * 100)}%</p></Flex>
                        <p style={{fontSize: "8px", marginTop: "2px", marginBottom: "0px"}}>Indeks</p>
                        {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25Corr']))}</>
                      : null
                  }

                  {data[3]['pm10'] ?
                      <><Flex style={flexStyle2} justifySpaceBetween><p><b>PM10: </b></p>
                        <p>{data[3]['pm10']}µg/m³ {Math.round(parseFloat(data[3]['pm10']) / 50 * 100)}%</p></Flex>
                        <p style={{fontSize: "8px", marginTop: "2px", marginBottom: "0px"}}>Indeks</p>
                        {airQualityInfo(getAirQualityIndexPM10(data[3]['pm10']))}</>
                      : null
                  }

                  <Flex className="padding-top-8 ml-4">
                    <WiTime9 size={24}/><p
                      style={{marginTop: "5px"}}>{format(Date.parse(data[3]['date']), 'yyyy.MM.dd HH:mm')}</p>
                  </Flex>
                  <div id="stats">
                    <Button variant="secondary" size="sm" value={data[2]} onClick={handleArchivalDataButtonClick}>Dane archiwalne</Button>
                  </div>
                </> : <></>
                }
              </Popup>
            </Marker>

        )
      }
    }))
  }

  const renderPrivateMarkersList = (markers) =>{
    deDuplicateStations();
    return (markers.map((data, idx) => {
      //show marker
      let ref1;

      if(stateShowMarker!=="" && stateShowMarker===data[2]){
        ref1=markerRef;
        console.log("Found marker!")
      }
      else{
        ref1=null;
      }
      //
      if(data[0] && data[1]) {
        return (
            <Marker ref={ref1} key={`marker-${idx}`} position={[data[0], data[1]]}  icon={greenMarker}>
              <Popup>
                <h5 style={{marginBottom: "10px"}}>{data[4]}</h5>

                <p style={{fontSize: "10px", marginTop: "-10px"}}>id: {data[2]} </p>


                {typeof(data[3])!="undefined" ? <>
                  <Flex style={flexStyle1}>
                    <WiThermometer size={24}/><p style={pStyle1}>{data[3]['temp']}°C</p>
                    <WiHumidity size={24}/><p style={pStyle1}>{data[3]['humidity']}%</p>
                    <WiBarometer size={24}/><p style={pStyle1}>{data[3]['pressure']}hPa</p>
                  </Flex>
                  {data[3]['pm25'] ?
                      <><Flex style={flexStyle2} justifySpaceBetween><p><b>PM2.5: </b></p><p>{data[3]['pm25']}µg/m³ {Math.round(parseFloat(data[3]['pm25'])/25*100)}%</p></Flex>
                        <p style={{fontSize: "8px", marginTop: "2px", marginBottom:"0px"}}>Indeks</p>
                        {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25']))}</>
                      : null}

                  {data[3]['pm25Corr'] ?
                      <><Flex style={flexStyle2} justifySpaceBetween><p style={{marginRight:"3px"}}><b>PM2.5 z korekcją: </b></p><p>{data[3]['pm25Corr']}µg/m³ {Math.round(parseFloat(data[3]['pm25Corr'])/25*100)}%</p></Flex>
                        <p style={{fontSize: "8px", marginTop: "2px", marginBottom:"0px"}}>Indeks</p>
                        {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25Corr']))}</>
                      : null
                  }

                  {data[3]['pm10'] ?
                      <><Flex style={flexStyle2} justifySpaceBetween><p><b>PM10: </b></p><p>{data[3]['pm10']}µg/m³ {Math.round(parseFloat(data[3]['pm10'])/50*100)}%</p></Flex>
                        <p style={{fontSize: "8px", marginTop: "2px", marginBottom:"0px"}}>Indeks</p>
                        {airQualityInfo(getAirQualityIndexPM10(data[3]['pm10']))}</>
                      : null
                  }
                  <Flex className="padding-top-8 ml-4">
                    <WiTime9 size={24}/><p style={{marginTop:"5px"}}>{format(Date.parse(data[3]['date']), 'yyyy.MM.dd HH:mm')}</p>
                  </Flex>
                  <div id="stats">
                    <Button variant="secondary" size="sm" value={data[2]} onClick={handleArchivalDataButtonClick}>Dane archiwalne</Button>
                  </div>
                </> : <></>
                }
              </Popup>
            </Marker>
        )
      }
    }))
  }

  
  const renderBookmarkMarkersList = (markers) =>{
    deDuplicateStations();
    return (markers.map((data, idx) => {
      //show marker
      let ref1;

      if(stateShowMarker!=="" && stateShowMarker===data[2]){
        ref1=markerRef;
        console.log("Found marker!")
      }
      else{
        ref1=null;
      }
      //
      if(data[0] && data[1]) {
        return (
            <Marker ref={ref1} key={`marker-${idx}`} position={[data[0], data[1]]} icon={goldMarker}>
              <Popup>
                <Flex justifySpaceBetween style={{marginTop:"-4px", paddingRight:"10px"}}>
                  <h5 style={{marginBottom: "10px"}}>{data[4]}</h5>
                  {stateIsLoggedIn ?
                      <>
                        {checkBookmark(data[2])?
                            <div><Button variant="secondary" size="sm" className="no-padding" value={data[2]} onClick={() => handleBookmarkButtonClick(data[2],"remove")}><BsBookmarkDashFill/></Button>
                            </div>
                            : <div><Button variant="secondary" size="sm" className="no-padding" value={data[2]} onClick={() => handleBookmarkButtonClick(data[2],"add")}><BsBookmarkPlus/></Button>
                            </div>}

                      </> : <></>}
                </Flex>

                <p style={{fontSize: "10px", marginTop: "-10px"}}>id: {data[2]} </p>


                {typeof(data[3])!="undefined" ? <>
                  <Flex style={flexStyle1}>
                    <WiThermometer size={24}/><p style={pStyle1}>{data[3]['temp']}°C</p>
                    <WiHumidity size={24}/><p style={pStyle1}>{data[3]['humidity']}%</p>
                    <WiBarometer size={24}/><p style={pStyle1}>{data[3]['pressure']}hPa</p>
                  </Flex>
                  {data[3]['pm25'] ?
                      <><Flex style={flexStyle2} justifySpaceBetween><p><b>PM2.5: </b></p><p>{data[3]['pm25']}µg/m³ {Math.round(parseFloat(data[3]['pm25'])/25*100)}%</p></Flex>
                        <p style={{fontSize: "8px", marginTop: "2px", marginBottom:"0px"}}>Indeks</p>
                        {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25']))}</>
                      : null}

                  {data[3]['pm25Corr'] ?
                      <><Flex style={flexStyle2} justifySpaceBetween><p style={{marginRight:"3px"}}><b>PM2.5 z korekcją: </b></p><p>{data[3]['pm25Corr']}µg/m³ {Math.round(parseFloat(data[3]['pm25Corr'])/25*100)}%</p></Flex>
                        <p style={{fontSize: "8px", marginTop: "2px", marginBottom:"0px"}}>Indeks</p>
                        {airQualityInfo(getAirQualityIndexPM25(data[3]['pm25Corr']))}</>
                      : null
                  }

                  {data[3]['pm10'] ?
                      <><Flex style={flexStyle2} justifySpaceBetween><p><b>PM10: </b></p><p>{data[3]['pm10']}µg/m³ {Math.round(parseFloat(data[3]['pm10'])/50*100)}%</p></Flex>
                        <p style={{fontSize: "8px", marginTop: "2px", marginBottom:"0px"}}>Indeks</p>
                        {airQualityInfo(getAirQualityIndexPM10(data[3]['pm10']))}</>
                      : null
                  }

                  <Flex className="padding-top-8 ml-4">
                    <WiTime9 size={24}/><p style={{marginTop:"5px"}}>{format(Date.parse(data[3]['date']), 'yyyy.MM.dd HH:mm')}</p>
                  </Flex>
                  <div id="stats">
                    <Button variant="secondary" size="sm" value={data[2]} onClick={handleArchivalDataButtonClick}>Dane archiwalne</Button>
                  </div>
                </> : <></>
                }
              </Popup>
            </Marker>

        )
      }
    }))
  }

  return (
    <>
    <div style={{display: "flex", flexDirection: "column"}}>
      <div style={{display: "flex", flex:1}}>
        <SideMenu/>
      </div>
        <div id="map">
          <MapContainer whenCreated={(map) => {
            mapRef.current = map;
          }} key={stateIsLoading} center={position} zoom={10} style={mapStyle} maxZoom={18} zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {stateIsLoading ? <></> :
          <>{renderMarkersList(stateMarkers)}
          {renderPrivateMarkersList(statePrivateMarkers)}
          {renderBookmarkMarkersList(stateBookmarkMarkers)}
          </>}
          
          <ZoomControl position="bottomright"/>
        </MapContainer>
      </div>
    </div>
    </>
  )
}

export default Map;