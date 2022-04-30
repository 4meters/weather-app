import React, { useState, useEffect} from "react";

import {MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'
import {Navigation} from 'react-minimal-side-navigation';
import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Chart from "./Chart"

import {useSearchParams} from 'react-router-dom';
//import 'SideNavigation.js'

//https://codereview.stackexchange.com/questions/235854/react-setstate-function-in-useeffect

function Statistics(props) {


  const [searchParams, setSearchParams] = useSearchParams();
  const [stateStationId,setStateStationId] = useState(searchParams.get("stationId"));
  const [stateStationName,setStateStationName] = useState("");



  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const getStationName=()=>{
    fetch(`http://192.168.1.202:8080/api/station/get-station-name/`+stateStationId)
          .then(res => res.json())//check if 404
          .then(response => {
              setStateStationName(response['stationName']);
          })
  }

  useEffect(() =>{
    if(stateStationId!=null){
      getStationName();
    }
    
  }, []) //only on first run, if not it breaks some things with no errors in console



  


  return (
    <>   
<div className="d-flex p-2 col-example">
  <NavList/>
</div>

      <div className="d-flex p-2 col-example">
        <div className="chart">
          {stateStationId!=null ?
          <>
          <h2>{stateStationName}</h2>
          <p>{stateStationId}</p>
          <Chart stationId={stateStationId}/>
          </>
          :
          <>
          <h2>You need to select 'archival data' from station marker on map</h2>
          </>
          }
          
        </div>
      <p></p>
      </div>
    </>
  )
}

export default Statistics;

