import React, { useState, useEffect} from "react";
import {MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents, useMap} from "react-leaflet";
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
import {useLocation,useNavigate,useParams, useSearchParams} from "react-router-dom";

import { Navigate } from "react-router-dom";

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

function AddStationOnMap(props){
  /*const map = useMapEvents({
    click: () => {
      map.locate()
    },
    locationfound: (location) => {
      console.log('location found:', location)
    },
  })*/


 /* const map = useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      setPosition({
        latitude: lat,
        longitude: lng,
      });
    },
  });*/
  //special one for new marker

  
  /*const map = useMapEvents({
    click(e) {                                
        console.log("tt")
    },            
  })*/
  //const location = useLocation();
  //let {id} = useParams();
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

  const navigate = useNavigate();
  //TODO pass (new) stationId from parent function --> done with ?stationId=

  //TODO add token, login check
  //TODO we are adding new station aka, location of station and name, stationId already in db, we need to update document!
  //also we need to assign station to user! basing on token we determine which user!
  //also ! we need to provide checkbox for setting private or public station it is!
  //if private we provide private station name
  //if public we provide public station name, which user can later change with private friendly name

  //change this basing on notebook 30-03-2022
  let REFRESH_TIME = 1000 * 60 * 5; //=5min
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  useEffect(()=>{
    refreshMarkers();
    //console.log("tt"+location.stationId)
    //console.log(id);
   // console.log(`/something/${id}`);
   //TODO maybe add check if there is stationId maybe not it seems to not be easy
   /*let stationId=searchParams.get('stationId').toString;
   console.log("TEST"+typeof(stationId));
   if(typeof(searchParams.get('stationId'))!="string"){
     console.log("No stationId provided")
     console.log(typeof(searchParams.get('stationId')))
   }
    console.log(searchParams.get('stationId'));*/
    //const updateTimer = setInterval(() => refreshMarkers(), REFRESH_TIME);
    //weatherData();

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
    console.log("dddd")
  },[stateMarkers])

  const saveMarker = (newMarkerCoords) => {
    /*let markersList=stateMarkers;
    markersList.push(newMarkerCoords);
    setStateMarkers(markersList);
    console.log(stateMarkers)
  //this.setState((prevState) => ({ ...prevState, data }));*/
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
  /*const map = useMapEvents({
    click: () => {
      map.locate()
    },
    locationfound: (location) => {
      console.log('location found:', location)
    },
  })*/

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
    //TODO add status check

    fetch(`http://127.0.0.1:8080/api/station/add-station-on-map`, requestParams)
        .then(response => {
            if(response.status===200){
              alert("Succesfully added")
              navigate("/")
              //TODO alert succesfully added, on alert close go to map
            }
            else{
              alert("Error - station may be already added")
              //TODO ERROR
            }
        })
  }

  const handleChangeNewStationName = event =>{
    setStateNewStationName(event.target.value);
  }

  const refreshMarkers = () => {
      fetch(`http://127.0.0.1:8080/api/station/get-public-stationlist`)
          .then(res => res.json())
          .then(stationList => {
            let stateStationList=stationList;//fix for access in second fetch
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

          
  //TODO merge measures into markers //TODO conditional rendering --no measures
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