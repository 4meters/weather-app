import React, { useState, useEffect} from "react";
import {MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents} from "react-leaflet";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

import L from 'leaflet';

import {useNavigate, useSearchParams} from "react-router-dom";

import {BASE_SERVER_URL} from '../ServerURL'
import SideMenu from "./nav/SideMenu";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const mapStyle = { height: "90vh" };

let position = [50.068, 21.255]



function AddStationOnMap(props){
  
  const [searchParams, setSearchParams] = useSearchParams();

  const [stateNewStationVisibility, setStateNewStationVisibility] = useState(true);

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);


  const [stateStationList,setStateStationList] = useState();
  const [stateMarkers,setStateMarkers] = useState([]);
  const [statePrivateMarkers,setStatePrivateMarkers] = useState([]);
  const [stateBookmarkMarkers,setStateBookmarkMarkers] = useState([]);

  const [stateNewMarker, setStateNewMarker] = useState([]);
  const [stateNewStationName, setStateNewStationName] = useState("");

  //render states
  const [stateAddedNewMarker, setStateAddedNewMarker] = useState(false);
  const [stateNewMarkerConfirmed, setStateNewMarkerConfirmed] = useState(false);

  const navigate = useNavigate();

  let REFRESH_TIME = 1000 * 60 * 5; //=5min
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  useEffect(()=>{
    refreshMarkers();
    console.log("Logged in:"+stateIsLoggedIn)
    let token=localStorage.getItem('token');
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
    const updateTimer = setInterval(() => refreshMarkers(), REFRESH_TIME); //refresh every 5min
  }, [])

  useEffect(()=>{
    if(stateIsLoggedIn){
      refreshPrivateMarkers();
      refreshBookmarkMarkers();
    }
  },[stateIsLoggedIn])

  const saveMarker = (newMarkerCoords) => {
    console.log(newMarkerCoords)
    setStateNewMarker(newMarkerCoords);
    setStateAddedNewMarker(true);
    console.log(stateNewMarker);
};

  function MyComponent({saveMarker}) {
    const map = useMapEvents({
      click: (event) => {

        const { lat, lng } = event.latlng;
        console.log(lng)
        saveMarker([lat,lng])
        
      },
      locationfound: (location) => {
        console.log('location found:', location)
      },
    })
    return null
  }

  const confirmNewMarker = () =>{
    console.log(stateNewMarkerConfirmed);
    setStateNewMarkerConfirmed(true);
  }

  const handleAddStationFinalRequest = event => {
    event.preventDefault();
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "token": stateToken,
        "stationId" : searchParams.get('stationId'),
        "lat" : stateNewMarker[0],
        "lng" : stateNewMarker[1],
        "stationName" : stateNewStationName,
        "visible" : stateNewStationVisibility
    })
    };

    fetch(BASE_SERVER_URL+`/api/station/add-station-on-map`, requestParams)
        .then(response => {
            if(response.status===200){
              alert("Stacja została dodana na mapę")
              navigate("/")
            }
            else{
              alert("Nie udało się dodać stacji na mapę")
            }
        })
  }

  const handleChangeNewStationName = event =>{
    setStateNewStationName(event.target.value);
  }
  

  const refreshMarkers = () => {
      fetch(BASE_SERVER_URL+`/api/station/get-public-stationlist`)
          .then(res => res.json())
          .then(stationList => {
            let stateStationList=stationList;
            setStateStationList(stationList);
            
            let markers = [];

            console.log(stateStationList);

            let size = stateStationList['stationList'].length;
            for(var i = 0; i < size ; i++){
              let item = stateStationList['stationList'][i];
              var markerPosition=[item['lat'], item['lng'], item['stationId']];
              markers.push(markerPosition);
            }
            console.log(stateStationList);
            console.log(markers);
            //setStateStationList(stationList);
            setStateMarkers(markers);
          
                  
      });
                
              
          
  }

  const refreshPrivateMarkers = () =>{
    fetch(BASE_SERVER_URL+`/api/user/get-user-mystationlist-details/`+stateToken)
    .then(res => res.json())
    .then(response => {
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
    })

  }

  const refreshBookmarkMarkers = () =>{
    fetch(BASE_SERVER_URL+`/api/user/get-user-bookmarkstationlist-details/`+stateToken)
    .then(res => res.json())
    .then(response => {
      let stationList=response['stationList']
      let measureList=response['measureList']

      let bookmarkMarkers = [];

      let size = stationList.length;
      for(var i = 0; i < size ; i++){
        let item = stationList[i];
        var markerPosition=[item['lat'], item['lng'], item['stationId'], measureList[item['stationId']], item['stationName']];
        bookmarkMarkers.push(markerPosition);
      }
      setStateBookmarkMarkers(bookmarkMarkers);
    })
  }

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
  

  const renderMarkersList = (markers) =>{
  deDuplicateStations();
  return (markers.map((data, idx) => {

    return (
      <Marker key={`marker-${idx}`} position={[data[0], data[1]]}>
            <Popup>
              <p>Id stacji: {data[2]} </p>
              <p>N: {data[0]}</p>
              <p>E: {data[1]}</p>
            </Popup>
          </Marker>
    )
    }))
  }

  const renderPrivateMarkersList = (markers) =>{
  deDuplicateStations();
    return (markers.map((data, idx) => {
    
      return (
        <Marker icon={greenMarker} key={`marker-${idx}`} position={[data[0], data[1]]}>
              <Popup>
                <p>Id stacji: {data[2]} </p>
                <p>N: {data[0]}</p>
                <p>E: {data[1]}</p>
              </Popup>
            </Marker>
      )
      }))
  }

  const renderBookmarkMarkersList = (markers) =>{
  deDuplicateStations();
    return (markers.map((data, idx) => {
    
      return (
        <Marker icon={goldMarker} key={`marker-${idx}`} position={[data[0], data[1]]}>
              <Popup>
                <p>Id stacji: {data[2]} </p>
                <p>N: {data[0]}</p>
                <p>E: {data[1]}</p>
              </Popup>
            </Marker>
      )
      }))
  }


const onChangeRadioButtonsVisibility = event =>{
  console.log(event.target.value)
  if(event.target.value==="public"){
    setStateNewStationVisibility(true)
  }
  else{
    setStateNewStationVisibility(false)
  }
  
}

const violetMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

  return (
    <>
    <div style={{display: "flex", flexDirection: "column"}}>
    <div style={{display: "flex", flex:1}}>
      <SideMenu/>
    </div>
      <div className="d-flex p-2 col-example">
        <h3>Wybierz lokalizację swojej stacji pogodowej</h3>
        <MapContainer center={position} zoom={10} style={mapStyle} maxZoom={18} zoomControl={false}>
          <MyComponent saveMarker={saveMarker}/>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {renderMarkersList(stateMarkers)}
        {renderPrivateMarkersList(statePrivateMarkers)}
        {renderBookmarkMarkersList(stateBookmarkMarkers)}
        {stateAddedNewMarker ?
        <Marker key='new-marker' position={stateNewMarker} icon={violetMarker}>
          <Popup>
            <h3>Lokalizacja nowej stacji:</h3>
            <p style={{marginBottom: "-20px"}}>N: {position[0]}</p>
            <p>E: {position[1]}</p>
            {!stateNewMarkerConfirmed ? <button onClick={confirmNewMarker}>Potwierdź lokalizację</button> : <></>}
            <div>
              {stateNewMarkerConfirmed ?
              
            <div>
              <form onSubmit={handleAddStationFinalRequest}>
                <label><b>Podaj nazwę stacji:</b><p style={{marginTop: "-10px"}}/>
                  <input type="text" value={stateNewStationName} onChange={handleChangeNewStationName} />
                </label>
                <p style={{marginBottom: "0px"}}><b>Widoczność:</b></p>



                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      value="public"
                      checked={stateNewStationVisibility === true}
                      onChange={onChangeRadioButtonsVisibility}
                    />
                    Publiczna
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      value="private"
                      checked={stateNewStationVisibility === false}
                      onChange={onChangeRadioButtonsVisibility}
                    />
                    Prywatna
                  </label>
                </div>
                <input style={{marginTop:"10px"}} type="submit" value="Potwierdź" />
              </form>
              </div> : <></>}</div>
          </Popup>
        </Marker> : <></>
        }
        
        <ZoomControl position="bottomright"/>
      </MapContainer>
      </div>
      </div>
    </>
  )
}

export default AddStationOnMap;