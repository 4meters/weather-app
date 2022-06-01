import React, { useState, useEffect} from "react";

import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Chart from "./Chart"

import {useSearchParams, useNavigate} from 'react-router-dom';
//import 'SideNavigation.js'

//https://codereview.stackexchange.com/questions/235854/react-setstate-function-in-useeffect

function ArchivalData(props) {

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);
  const [stateMyStationList,setStateMyStationList] = useState([]);
  const [stateBookmarkStationList,setStateBookmarkStationList] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [stateStationId,setStateStationId] = useState(searchParams.get("stationId"));
  const [stateStationName,setStateStationName] = useState("");

  const navigate = useNavigate();

  const BASE_SERVER_URL = "https://weather-serverapplication.herokuapp.com"
  //const BASE_SERVER_URL = "http://127.0.0.1:8080"

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const getStationName=()=>{
    fetch(BASE_SERVER_URL+`/api/station/get-station-name/`+stateStationId)
          .then(res => res.json())
          .then(response => {
              setStateStationName(response['stationName']);
          })
  }

  useEffect(() =>{
    if(stateStationId!=null){
      getStationName();
    }

    console.log("Logged in:"+stateIsLoggedIn)
    console.log(stateToken);
    let token=localStorage.getItem('token');
    if(typeof(token)==="string"){
      if(token.length>0){
        setStateToken(localStorage.getItem('token'));
        setStateIsLoggedIn(true);
        getUserStationList();
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
    if(stateIsLoggedIn==true){
      getUserStationList();
    }
    
  },[stateToken])

  useEffect(()=>{
    getStationName();
  }, [stateStationId])

  useEffect(()=>{
    setStateStationId(searchParams.get("stationId"));
  })

  const getUserStationList = () => {
    //TODO add status check
    //TODO empty list catch
    //fetch(`http://127.0.0.1:8080/api/user/get-user-stationlist/`+stateToken)
    fetch(BASE_SERVER_URL+`/api/user/get-user-stationlist/`+stateToken)
        .then(res => res.json())
        .then(response => {
            setStateMyStationList(response['myStationList'])
            setStateBookmarkStationList(response['bookmarkStationList'])
            //console.log(response)
        })
  }

  const handleArchivalDataButtonClick = (stationId) =>{
    navigate("/archival-data?stationId="+stationId)
    setStateStationId(stationId);
  }

  const renderStationItemListLite = (stationlist) =>{
    return (stationlist.map((data,idx)=>{
      console.log(data)
      return (<div key={idx} style={{
        backgroundColor: '#DDDDDD'
      }}>
      <h3>{data['stationName']}</h3>
      <p style={{fontSize:"12px", marginTop:"-10px"}}>id: {data['stationId']}</p>
      {
        data['active'] ? <><p><b>Status: </b>Pomiary włączone</p></> : <><p><b>Status: </b>Pomiary wyłączone</p></>
      }
      <button onClick={()=>handleArchivalDataButtonClick(data['stationId'])}>Dane archiwalne</button>
      
      </div>)
    }))
  }


  return (
    <>   
<div className="d-flex p-2 col-example">
  <NavList/>
</div>

      <div className="d-flex p-2 col-example">
        <div className="chart">
          {stateStationId!=null ?
          <>
          <h1>Dane archiwalne</h1>
          <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
          <h2>{stateStationName}</h2>
          <p style={{fontSize: "14px", marginTop: "-10px"}}>id: {stateStationId}</p>
          <Chart stationId={stateStationId}/>
          </>
          :
          <>
          {stateIsLoggedIn? 
          <>
          <div className="StationList">
            <h1>Dane archiwalne</h1>
            <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
          <div className="my-stations">
            <h2>Moje stacje</h2>
            {stateMyStationList.length>0 ? 
            <>{renderStationItemListLite(stateMyStationList)}</>
            :
            <><p>(Pusta lista)</p>
            </>
            }
            </div>
            <div className="watched-stations">
            <h2>Zakładki</h2>
            {stateBookmarkStationList.length>0 ? 
            <>{renderStationItemListLite(stateBookmarkStationList)}</>
            :
            <><p>(Pusta lista)</p>
            </>
            }
            </div>
          </div>
          </> 
          : <>
          <h1>Dane archiwalne</h1>
          <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
          <h2>Należy wybrać opcję 'dane archiwalne' z znacznika stacji na mapie lub zalogować się</h2>
          </>}
          
          </>
          }
          
        </div>
      <p></p>
      </div>
    </>
  )
}

export default ArchivalData;

