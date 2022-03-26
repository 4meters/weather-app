import React, { useState } from "react";
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


function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    console.log(location)
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

class Map extends React.Component  {
  
  constructor(props, context) {
    super(props, context);
  }

  state = {
    stationList: [],
    markers: [],
    stationLastMeasure: []
  };

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  componentDidMount() {
    this.refreshMarkers();
    this.weatherData();
    console.log(this.props.location)
  }

  refreshMarkers = () => {
      fetch(`http://127.0.0.1:8080/api/station/get-stationlist`)
          .then(res => res.json())
          .then(stationList => {
              let markers = [];
              
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
              });
              this.setState({
                ...this.state,
                markers
            });
          })
  }


  weatherData = function(stationId){
    fetch(`http://127.0.0.1:8080/api/measure/last-measure`)
          .then(res => res.json())
          .then(measure => {
              this.setState({
                ...this.state,
                stationLastMeasure: measure
            });
            console.log(this.state.stationLastMeasure)
            
          })
          
  } 


  renderItem = ({position}) => {
    return (
      <Marker position={position}><Popup>
      <p>Test</p>
      </Popup>
      </Marker>
    )
}
  
render(){ 
  const markersList = this.state.markers.map((data) => {
    return (
      <Marker position={[data[0], data[1]]}>
             <Popup>
               <p>Station id: {data[2]} </p>
               <p><b>Temp: </b>{this.state.stationLastMeasure['temp']}</p>
               <p><b>Humidity: </b>{this.state.stationLastMeasure['humidity']}</p>
               <p><b>Pressure: </b>{this.state.stationLastMeasure['pressure']}</p>
               <p><b>pm25: </b>{this.state.stationLastMeasure['pm25']}</p>
               <p><b>pm25corr: </b>{this.state.stationLastMeasure['pm25Corr']}</p>
               <p><b>pm10: </b>{this.state.stationLastMeasure['pm10']}</p>
               <p><b>Measure time: </b>{this.state.stationLastMeasure['date']}</p>
               <button onClick={this.showStatistics}>Statistics</button>
               <div id="stats">
                 <Chart></Chart>
               </div>
             </Popup>
           </Marker>
    )
  })
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
  );}
}

export default withRouter(Map);

/*for(let el of stationList){
                let markerPosition=[el['geolocationCoordinateN'], el['geolocationCoordinateE']];
                markers.push(markerPosition);
              }*/

/*this.state [markers, setMarkers] = useState([
    {
      position: { lng: -122.673447, lat: 45.5225581 },
      text: "Voodoo Doughnut"
    }
  ]);*/

/*handleClick = () => {
    setMarkers([
      {
        position: { lng: -110.673447, lat: 40.5225581 },
        text: "Voodoo Doughnut"
      },
      {
        position: { lng: -110.6781446, lat: 40.5225512 },
        text: "Bailey's Taproom"
      },
      {
        position: { lng: -110.67535700000002, lat: 40.5192743 },
        text: "Barista"
      }
    ]);
  };*/

  /*    
          /*for(let el of stationList){
                let markerPosition=[el['geolocationCoordinateN'], el['geolocationCoordinateE']];
                markers.push(markerPosition);
              }*/
          /*    let size = stationList['stationList'].length;
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
              });
              this.setState({
                ...this.state,
                markers
            });
          })*/