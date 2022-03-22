import React, { useState } from "react";
import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
//import 'SideNavigation.js'
import L from 'leaflet';
import Chart from './Chart';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const mapStyle = { height: "90vh" };

let position = [50.068, 21.255]

class Map extends React.Component  {
  
  

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

  return (
    <>
      <div className="d-flex p-2 col-example">
        <MapContainer center={position} zoom={12} style={mapStyle} maxZoom={18}>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {markersList}

      </MapContainer>
      <button >Change cluster</button>
      </div>
      <div className="d-flex p-2 col-example">
        <p>test</p>
        <p>test2</p>
      </div>
    </>
  );}
}

export default Map;

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