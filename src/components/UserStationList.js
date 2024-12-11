import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";

import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Flex from '@react-css/flex'

import EdiText from 'react-editext';

import SideMenu from "./nav/SideMenu";
import Header from "./styling-components/Header";
import {Button} from "react-bootstrap";
import * as userStationListApi from '../API/UserStationListApi'

function UserStationList(props) {

  const [stateToken,setStateToken] = useState("");
  const [stateIsLoggedIn,setStateIsLoggedIn] = useState(false);
  const [stateMyStationList,setStateMyStationList] = useState([]);
  const [stateBookmarkStationList,setStateBookmarkStationList] = useState([]);


  const navigate = useNavigate();


  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }


  useEffect(() =>{
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
    console.log("Logged in:"+stateIsLoggedIn)
  }, [])

  useEffect(()=>{
    if(stateIsLoggedIn === true){
      getUserStationList();
    }
    
  },[stateToken])


  const getUserStationList = () => {
    userStationListApi.getUserStationListRequest(stateToken, (response) => {
      setStateMyStationList(response['myStationList'])
      setStateBookmarkStationList(response['bookmarkStationList'])
    })
  }


  const handleClickLogin = () =>{
    navigate("/login")
  }

  const handleClickShowOnMap = (stationId) =>{
    navigate("/?stationId="+stationId)
  }

  const handleRemoveStationButton = (stationId) =>{
    let result = window.confirm("Czy na pewno chcesz usunąć stację pogodową?\nWszystkie wyniki pomiarów zostaną również usunięte.")
    console.log(stationId)
    if(result){
      userStationListApi.removeStationRequest(stationId, stateToken, (res)=>{
        if(res.status===200){
          alert("Stacja pogodowa została usunięta")
          getUserStationList();
        }
        else{
          alert("Nie udało się usunąć stacji pogodowej z bazy danych")
        }
      })
    }
    else{
      alert("Stacja pogodowa nie została usunięta")
    }
  }

  const handleStationModeButton=(event) =>{
    userStationListApi.switchStationModeRequest(event.target.value, stateToken, (res)=>{
      if(res.status===200){
        getUserStationList();
      }
    })
  }

  const handleChangeMeasureInterval = (measureInterval, stationId) =>{
    console.log(measureInterval, stationId)
    userStationListApi.setMeasureIntervalRequest(stateToken, measureInterval, stationId, (res)=>{
      if(res.status===200){
        getUserStationList();
      }
    })
  }

  const handleChangeVisibility = (visibility, stationId) =>{
    console.log(visibility, stationId)
    if(visibility==="true"){
      userStationListApi.setVisibilityRequest(stateToken, true, stationId, (res)=>{
        if(res.status===200){
          getUserStationList();
        }
      })
    }
    else{
      userStationListApi.setVisibilityRequest(stateToken, false, stationId, (res)=>{
        if(res.status===200){
          getUserStationList();
        }
      })
    }
  }

  const handleSaveStationName = (newStationName, data) =>{
    userStationListApi.saveStationNameRequest(stateToken, newStationName, data, (res)=>{
      if(res.status===200){
        getUserStationList();
      }
    })
  }


  const pStyle={marginTop:"2px", marginBottom:"2px"}

  const renderMyStationItemList = (stationlist) => {
    return (stationlist.map((data, idx) => {
      console.log(data)
      return (<div id={idx} className="mt8" key={idx} style={{
        backgroundColor: "rgb(247, 247, 247)"//'#DDDDDD'
      }}>
        <div style={{
          backgroundColor: "#DDDDDD",
          maxWidth: "400px"
        }}>
          <h3><EdiText value={data['stationName']} onSave={(value) => handleSaveStationName(value, data)}/></h3>
        </div>


        <p style={{fontSize: "12px", marginTop: "-10px"}}>id: {data['stationId']}</p>

        <Flex style={{flexDirection: "column"}}>
          <Flex style={{flexDirection: "row"}}>
            <p style={pStyle} className="flex-align-center"><b style={{marginRight: "33px"}}>Widoczność:</b>
              {data['visible'] != null ? <>
                <select className="form-select" name="visibility" id="visibility"
                        onChange={(event) => handleChangeVisibility(event.target.value, data['stationId'])}
                        value={data['visible']}>
                  <option value="true">Publiczna</option>
                  <option value="false">Prywatna</option>
                </select>
              </> : <></>}
            </p>
          </Flex>
          <Flex style={{flexDirection: "row"}}>
            <p style={pStyle} className="flex-align-center"><b style={{marginRight: "10px"}} className="whitespace-nowrap">Interwał pomiaru:</b>
              {data['measureInterval'] != null && data['measureInterval'] !== "" ? <>
                <select className="form-select" name="measureInterval" id="measureInterval"
                        onChange={(event) => handleChangeMeasureInterval(event.target.value, data['stationId'])}
                        value={data['measureInterval']}>
                  <option value="3min">3min</option>
                  <option value="5min">5min</option>
                  <option value="10min">10min</option>
                  <option value="15min">15min</option>
                </select>
              </> : <></>}</p>
          </Flex>

          <Flex style={{flexDirection: "row"}}>
            {data['active'] != null ?
                <>
                  {
                    data['active'] ? <><p style={pStyle}><b>Status: </b>Pomiary włączone</p></> : <><p><b>Status: </b>Pomiary
                      wyłączone</p></>
                  }
                </> : <></>}
          </Flex>
        </Flex>

        <p/>

        <div className="action-buttons">
          {data['lat'] != null && data['lng'] != null ? <>
            <Button onClick={() => handleClickShowOnMap(data['stationId'])}>Pokaż na mapie</Button>
          </> : <></>
          }


          {data['active'] != null && data['active'] !== "" ? <>
            {
              data['active'] ? <Button value={'{"stationId":"' + data['stationId'] + '", "mode": "disable"}'}
                                       onClick={handleStationModeButton}>Wyłącz pomiary</Button>
                  : <Button value={'{"stationId":"' + data['stationId'] + '", "mode": "enable"}'}
                            onClick={handleStationModeButton}>Włącz pomiary</Button>
            }
          </> : <></>}

          <Button variant="danger" onClick={() => handleRemoveStationButton(data['stationId'])}>Usuń stację</Button>
        </div>
      </div>)
    }))
  }

  const renderBookmarkStationItemList = (stationlist) => {
    return (stationlist.map((data, idx) => {
      console.log(data)
      return (<div id={idx} className="mt8" key={idx} style={{
        backgroundColor: '#DDDDDD'
      }}>
        <h3>{data['stationName']}</h3>
        <p style={{fontSize: "12px", marginTop: "-10px"}}>id: {data['stationId']}</p>
        {data['visible'] ? <p id="visibility"><b>Widoczność: </b>Publiczna</p> :
            <p id="visibility"><b>Widoczność: </b>Prywatna</p>}
        {data['active'] != null ?
            <>
              {
                data['active'] ? <><p><b>Status: </b>Pomiary włączone</p></> : <><p><b>Status: </b>Pomiary wyłączone
                </p></>
              }
            </> : <></>}

        <Button onClick={() => handleClickShowOnMap(data['stationId'])}>Pokaż na mapie</Button>

      </div>)
    }))
  }

  return (
      <>
        <div>
          <SideMenu/>
        </div>

        <div className="content-padding">
          <Header headerText="Lista stacji"/>
          {!stateIsLoggedIn ?
              <div id="Login">
                <h3>Musisz się zalogować</h3>
                <div>
                  <Button onClick={handleClickLogin}>Zaloguj się</Button>
                </div>
              </div>
              : <div id="StationList">
                <div id="my-stations">
                  <h2>Moje stacje</h2>
                  {stateMyStationList.length > 0 ?
                      <>{renderMyStationItemList(stateMyStationList)}</>
                      :
                      <><p>(Pusta lista)</p>
                      </>
                  }
                </div>
                <div id="watched-stations">
                  <h2 className="mt16">Zakładki</h2>
                  {stateBookmarkStationList.length > 0 ?
                      <>{renderBookmarkStationItemList(stateBookmarkStationList)}</>
                      :
                      <><p>(Pusta lista)</p>
                      </>
                  }
                </div>
              </div>

          }

        </div>
      </>
  )
}

export default UserStationList;