import React, { useState, useEffect} from "react";
import {MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents} from "react-leaflet";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

import L from 'leaflet';


import NavList from "./NavList";

import {useNavigate, useSearchParams} from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const mapStyle = { height: "90vh" };

let position = [50.068, 21.255]

import {BASE_SERVER_URL} from '../ServerURL'

function AddStationOnMap(props){
  
  const [searchParams, setSearchParams] = useSearchParams();

  const [stateNewStationVisibility, setStateNewStationVisibility] = useState(true);

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);


  const [stateStationList,setStateStationList] = useState();
  const [stateMarkers,setStateMarkers] = useState([]);

  const [stateNewMarker, setStateNewMarker] = useState([]);
  const [stateNewStationName, setStateNewStationName] = useState("");

  //render states
  const [stateAddedNewMarker, setStateAddedNewMarker] = useState(false);
  const [stateNewMarkerConfirmed, setStateNewMarkerConfirmed] = useState(false);

  //const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"
  //const BASE_SERVER_URL = "http://127.0.0.1:8080"

  const navigate = useNavigate();

  //TODO add token, login check
  //TODO we are adding new station aka, location of station and name, stationId already in db, we need to update document!

  //change this basing on notebook 30-03-2022
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
      }
      else{
        setStateIsLoggedIn(false);
      }
    }
    else{
      setStateIsLoggedIn(false);
      }
  }, [])

  useEffect(()=>{
    console.log("1")
  },[stateMarkers])

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

          
const markersList = (markers) =>{

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


const onChangeRadioButtonsVisibility = event =>{
  console.log(event.target.value)
  if(event.target.value==="public"){
    setStateNewStationVisibility(true)
  }
  else{
    setStateNewStationVisibility(false)
  }
  
}
//TODO conditional navigation render
  return (
    <>
    <div style={{display: "flex", flexDirection: "column"}}>
    <div style={{display: "flex", flex:1}}>
    <NavList/>
    </div>
      <div className="d-flex p-2 col-example">
        <h3>Wybierz lokalizację swojej stacji pogodowej</h3>
        <MapContainer center={position} zoom={10} style={mapStyle} maxZoom={18} zoomControl={false}>
          <MyComponent saveMarker={saveMarker}/>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {markersList(stateMarkers)}
        {stateAddedNewMarker ?
        <Marker key='new-marker' position={stateNewMarker}>
          <Popup>
            <h3>Lokalizacja nowej stacji:</h3>
            <p>N: {position[0]}</p>
            <p>E: {position[1]}</p>
            {!stateNewMarkerConfirmed ? <button onClick={confirmNewMarker}>Potwierdź lokalizację</button> : <></>}
            <div>
              {stateNewMarkerConfirmed ?
              
            <div>
              <form onSubmit={handleAddStationFinalRequest}>
                <label>Podaj nazwę stacji:<p/>
                  <input type="text" value={stateNewStationName} onChange={handleChangeNewStationName} />
                </label>
                <p><b>Widoczność:</b></p><p/>



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
                <input type="submit" value="Potwierdź" />
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