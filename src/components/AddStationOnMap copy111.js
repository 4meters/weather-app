import React, { useState, useEffect } from "react";
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
import {useLocation,useNavigate,useParams} from "react-router-dom";

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
  const map = useMapEvents({
    click: () => {
      map.locate()
    },
    locationfound: (location) => {
      console.log('location found:', location)
    },
  })

  const [stateStationList,setStateStationList] = useState();
  const [stateMarkers,setStateMarkers] = useState([]);
  const [stateStationLastMeasure,setStateStationLastMeasure] = useState([]);

  let REFRESH_TIME = 1000 * 60 * 5; //=5min
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  useEffect(()=>{
    refreshMarkers();
    const updateTimer = setInterval(() => refreshMarkers(), REFRESH_TIME);
    //weatherData();
  }, [])

  /*const map = useMapEvents({
    click: () => {
      map.locate()
    },
    locationfound: (location) => {
      console.log('location found:', location)
    },
  })*/

  const refreshMarkers = () => {
      fetch(`http://127.0.0.1:8080/api/station/get-stationlist`)
          .then(res => res.json())
          .then(stationList => {
            let stateStationList=stationList;//fix for access in second fetch
            setStateStationList(stationList);
            
            let markers = [];

            console.log(stateStationList);

            let size = stateStationList['stationList'].length;
            for(var i = 0; i < size ; i++){
              let item = stateStationList['stationList'][i];
              var markerPosition=[item['geolocationCoordinateN'], item['geolocationCoordinateE'], item['stationId']];
              markers.push(markerPosition);
            }
            console.log(stateStationList);
            console.log(markers);
            //setStateStationList(stationList);
            setStateMarkers(markers);
          
                  
      });
                
              
          
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
const markersList = stateMarkers.map((data) => {

  /*const map = useMapEvents({
    click(e) {                                
        setSelectedPosition([
            e.latlng.lat,
            e.latlng.lng
        ]);                
    },            
  })*/

  

  return (
    <Marker position={[data[0], data[1]]}>
           <Popup>
             <p>Station id: {data[2]} </p>
             <p>N: {data[0]}</p>
             <p>E: {data[1]}</p>

           </Popup>
         </Marker>
  )

/*
  <p><b>Temp: </b>{stateStationLastMeasure[data[2]]['temp']}</p>
             <p><b>Humidity: </b>{stateStationLastMeasure[data[2]]['humidity']}</p>
             <p><b>Pressure: </b>{stateStationLastMeasure[data[2]]['pressure']}</p>
             <p><b>pm25: </b>{stateStationLastMeasure[data[2]]['pm25']}</p>
             <p><b>pm25corr: </b>{stateStationLastMeasure[data[2]]['pm25Corr']}</p>
             <p><b>pm10: </b>{stateStationLastMeasure[data[2]]['pm10']}</p>
             <p><b>Measure time: </b>{stateStationLastMeasure[data[2]]['date']}</p>
*/
})//<button onClick={showStatistics}>Statistics</button>


//TODO conditional navigation render
  return (
    <>
    <div style={{display: "flex", flexDirection: "column"}}>
    <div style={{display: "flex", flex:1}}>
    <NavList/>
    <nav>
      <ul>
        <li>
          <NavLink
            to=""
            style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
          >
            Map
          </NavLink>
        </li>
        <li>
          <NavLink
            to="login"
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
          >
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
    </div>
      <div className="d-flex p-2 col-example">
        <h3>Select location of your weather station</h3>
        <MapContainer center={position} zoom={12} style={mapStyle} maxZoom={18} zoomControl={false}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {markersList}
        <ZoomControl position="bottomright"/>
      </MapContainer>
      <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
      <div className="d-flex p-2 col-example">
        <p>test</p>
        <p>test2</p>
      </div>
      </div>
    </>
  )
}

export default AddStationOnMap;