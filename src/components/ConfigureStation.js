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

function ConfigureStation(props) {


  const [searchParams, setSearchParams] = useSearchParams();
  const [stateStationId,setStateStationId] = useState(searchParams.get("stationId"));
  const [stateStationName,setStateStationName] = useState("");

  const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const getStationName=()=>{
    fetch(BASE_SERVER_URL+`/api/station/get-station-name/`+stateStationId)
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

        <div className="chart">
          <h1>Konfiguracja stacji</h1>
          <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
          <p>Aby skonfigurować połączenie 
            WiFi w stacji pogodowej, połącz się z siecią o nazwie <b>Konfiguracja Wifi 1.1</b>,
            a następnie przejdź pod adres:</p>
            <a href="http://10.0.0.1">http://10.0.0.1</a>
            <p>Wybierz sieć, z którą chcesz się połączyć i wprowadź hasło.</p>
            <p>Po restarcie urządzenie powinno się połączyć z siecią.</p>
            <p style={{marginTop:"30px"}}>W razie niepowodzenia konfiguracji lub chęci zmiany punktu dostępowego, można zrestować konfiguracje za pomocą przycisku umieszczonego na obudowie.</p>
          
        </div>

    </>
  )
}

export default ConfigureStation;

