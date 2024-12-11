import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router";

import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Flex from '@react-css/flex'


import EdiText from 'react-editext';

import {BASE_SERVER_URL} from '../ServerURL'
import SideMenu from "./nav/SideMenu";
import Header from "./styling-components/Header";
import {Button} from "react-bootstrap";

import * as adminPanelApi from "../API/AdminPanelAPI";


function AdminPanel(props) {

    const [stateToken, setStateToken] = useState("");
    const [stateIsLoggedIn, setStateIsLoggedIn] = useState(false);
    const [stateIsAdmin, setStateIsAdmin] = useState(false);
    const [stateUserList, setStateUserList] = useState([]);
    const [stateStationList, setStateStationList] = useState([]);

    const [stateIsAddingNewStation, setStateIsAddingNewStation] = useState(false);
    const [stateNewStationId, setStateNewStationId] = useState("");
    const [stateNewStationKey, setStateNewStationKey] = useState("");


    const navigate = useNavigate();


    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }


    useEffect(() => {
        console.log("Logged in:" + stateIsLoggedIn)
        console.log(stateToken);
        let token = localStorage.getItem('token');
        if (typeof (token) === "string") {
            if (token.length > 0) {
                setStateToken(localStorage.getItem('token'));
                setStateIsLoggedIn(true);
                getUserList();
            } else {
                setStateIsLoggedIn(false);
            }
        } else {
            setStateIsLoggedIn(false);
        }
    }, []) //only on first run, if not it breaks some things with no errors in console

    useEffect(() => {
        validateIfAdminRequest(stateToken);
        if (stateIsLoggedIn === true) {
            getUserList();
            getStationList();
        }

    }, [stateToken])


    const getUserList = () => {
        fetch(BASE_SERVER_URL + `/api/admin/get-all-users?token=` + stateToken)
            .then(res => res.json())
            .then(response => {
                setStateUserList(response['userList'])
            })
    }

    const validateIfAdminRequest = () => {
        fetch(BASE_SERVER_URL + `/api/admin/verify-admin?token=` + stateToken)
            .then(response => {
                //console.log(response)
                if (response.status === 200) {
                    //getUserList();
                    setStateIsAdmin(true);
                } else {
                    throw new Error(response.status)
                }
            })
            .catch((error) => {
                setStateIsAdmin(false);
                console.log('error: not an admin' + error)
            })
    }
    const getStationList = () => {
        fetch(BASE_SERVER_URL + `/api/admin/get-all-stations?token=` + stateToken)
            .then(res => res.json())
            .then(response => {
                setStateStationList(response['stationList'])
            })
    }


    const handleClickLogin = () => {
        navigate("/login")
    }

    const handleStationModeButton = (event) => {
        adminPanelApi.switchStationModeRequest(event.target.value, stateToken, getStationList)
    }

    const handleChangeMeasureInterval = (measureInterval, stationId) => {
        console.log(measureInterval, stationId)
        adminPanelApi.setMeasureIntervalRequest(measureInterval, stationId, stateToken, getStationList)
    }

    const handleRemoveStationButton = (stationId) => {
        console.log(stationId)
        let result = window.confirm("Czy na pewno usunąć z mapy stację o id: " + stationId + "?\nZostaną usunięte również wszystkie pomiary.\nStacja będzie mogła być aktywowana w przyszłości")
        if (result) {
            adminPanelApi.removeStationRequest(stationId, stateToken,getStationList)
        } else {
            alert("Stacja nie została usunięta")
        }
    }

    const handleRemoveStationFromDbButton = (stationId) => {
        console.log(stationId)
        let result = window.confirm("Czy na pewno usunąć z bazy danych stację o id: " + stationId + "?\nZostaną usunięte również wszystkie pomiary.\nStacja nie będzie mogła być aktywowana w przyszłości")
        if (result) {
            adminPanelApi.removeStationFromDbRequest(stationId, stateToken, getStationList)
        } else {
            alert("Stacja nie została usunięta z bazy danych")
        }
    }

    const handleChangeVisibility = (visibility, stationId) => {
        console.log(visibility, stationId)
        if (visibility === "true") {
            adminPanelApi.setVisibilityRequest(true, stationId, stateToken, getStationList)
        } else {
            adminPanelApi.setVisibilityRequest(false, stationId, stateToken, getStationList)
        }
    }

    const handleResetUserPasswordButton = (userId, login) => {
        let result = window.confirm("Czy na pewno chcesz zresetować hasło do konta użytkownika o loginie: " + login)
        if (result) {
            adminPanelApi.resetUserPasswordRequest(userId, stateToken)
        } else {
            alert("Hasło nie zostało zresetowane")
        }
    }

    const handleRemoveUserButton = (userId, login) => {
        let result = window.confirm("Czy na pewno chcesz usunąć konto użytkownika o loginie: " + login)
        if (result) {
            adminPanelApi.removeUserAccountRequest(userId, stateToken, ()=>{
                getUserList();
                getStationList();
            })
        } else {
            alert("Konto nie zostało usunięte")
        }
    }

    const handleClickShowOnMap = (stationId) => {
        navigate("/?stationId=" + stationId)
    }


    const handleSaveStationName = (newStationName, data) => {
        const requestParams = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "token": stateToken,
                "stationId": data['stationId'],
                "newStationName": newStationName
            })
        };
        fetch(BASE_SERVER_URL + `/api/station/change-station-name`, requestParams)
            .then(response => {
                if (response.status === 200) {
                    getStationList();
                }
            })
    }

    //const renderStationItem = (data,idx) =>

    //const renderBookmarkStationItem = (data,idx) =>

    const pStyle = {marginTop: "2px", marginBottom: "2px"}

    const renderStationList = (stationlist) => {
        return (stationlist.map((data, idx) => {
            console.log(data)
            return (<div id={idx} className="mt8" key={idx} style={{
                backgroundColor: '#DDDDDD'
            }}>
                <div className="admin-panel-station-list">
                    <h3><EdiText value={data['stationName']} onSave={(value) => handleSaveStationName(value, data)}/>
                    </h3>
                </div>


                <p style={{fontSize: "12px", marginTop: "-10px"}}>id: {data['stationId']}</p>
                <p style={{fontSize: "12px", marginTop: "-10px"}}>klucz: {data['stationKey']}</p>

                <Flex style={{flexDirection: "column"}}>
                    <Flex style={{flexDirection: "row"}}>
                        <p className="flex-align-center" style={pStyle}><b style={{marginRight: "33px"}}>Widoczność:</b>
                            {data['visible'] != null ? <>
                                <select className="form-select" name="visibility" id="visibility"
                                        onChange={(event) => handleChangeVisibility(event.target.value, data['stationId'])}
                                        value={data['visible']}>
                                    <option value="true">Publiczna</option>
                                    <option value="false">Prywatna</option>
                                </select>
                            </> : <></>}</p>
                    </Flex>
                    <Flex style={{flexDirection: "row"}}>
                        <p className="flex-align-center" style={pStyle}><b className="whitespace-nowrap" style={{marginRight: "10px"}}>Interwał pomiaru:</b>
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
                                    data['active'] ? <><p style={pStyle}><b>Status: </b>Pomiary włączone</p></> : <><p>
                                        <b>Status: </b>Pomiary wyłączone</p></>
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
                            data['active'] ?
                                <Button value={'{"stationId":"' + data['stationId'] + '", "mode": "disable"}'}
                                        onClick={handleStationModeButton}>Wyłącz pomiary</Button>
                                : <Button value={'{"stationId":"' + data['stationId'] + '", "mode": "enable"}'}
                                          onClick={handleStationModeButton}>Włącz pomiary</Button>
                        }
                    </> : <></>}


                    <Button variant="danger"
                            onClick={() => handleRemoveStationButton(data['stationId'])}>Usuń stację
                    </Button>
                    <Button variant="danger"
                            onClick={() => handleRemoveStationFromDbButton(data['stationId'])}>Usuń stację z bazy danych
                    </Button>
                </div>
            </div>)
        }))
    }

    const renderUserList = (userList) => {
        return (userList.map((data, idx) => {
            console.log(data)
            return (<div key={idx} className="mt8" style={{
                backgroundColor: '#DDDDDD'
            }}>
                {data['login'] && <h3>{data['login']}</h3>}
                <p style={{fontSize: "9px", marginBottom: "-4px"}}>userId:</p>
                <p>{data['userId']}</p>

                <div className="action-buttons">
                    <Button onClick={() => handleResetUserPasswordButton(data['userId'], data['login'])}>Zresetuj hasło
                    </Button>
                    <Button variant="danger" onClick={() => handleRemoveUserButton(data['userId'], data['login'])}>Usuń konto
                    </Button>
                </div>

            </div>)
        }))
    }


    return (
        <>
            <div>
                <SideMenu/>
            </div>

            <div className="content-padding">
                <Header headerText="Panel administracyjny"/>
                {!stateIsLoggedIn || !stateIsAdmin ?
                    <div className="Login">
                        <h3>Musisz się zalogować z użyciem danych konta administratora</h3>
                        <div>
                            <Button onClick={handleClickLogin}>Strona logowania</Button>
                        </div>
                    </div>
                    : <div>
                        <div id="admin-panel">

                            <Flex className="admin-panel-header">
                                <h2>Stacje pogodowe</h2>
                                <Button onClick={() => {
                                    setStateIsAddingNewStation(true)
                                }}>Dodaj stację do bazy danych
                                </Button>
                            </Flex>

                            {stateIsAddingNewStation ? <>
                                <h2>Nowa stacja</h2>
                                <h3>Podaj dane stacji:</h3>
                                <form onSubmit={(e)=>
                                    adminPanelApi.addStationToDbRequest(e, stateToken, stateNewStationKey, stateNewStationKey, ()=>{
                                        setStateIsAddingNewStation(false);
                                        getUserList();
                                        getStationList();
                                })}>
                                    <label>Id stacji:<p/>
                                        <input className="form-control" type="text" value={stateNewStationId}
                                               onChange={(event) => setStateNewStationId(event.target.value)}/>
                                    </label>
                                    <p/>
                                    <label>Klucz stacji:<p/>
                                        <input className="form-control" type="text" value={stateNewStationKey}
                                               onChange={(event) => setStateNewStationKey(event.target.value)}/>
                                    </label><p/>
                                    <input className="btn btn-primary" type="submit" value="Zapisz stację"/>
                                </form>
                            </> : <></>}

                            {stateStationList.length > 0 ?
                                <>{renderStationList(stateStationList)}</>
                                :
                                <><p>(Pusta lista)</p>
                                </>
                            }
                        </div>
                        <div id="user-list" className="mt16">
                            <h2>Użytkownicy</h2>
                            {stateUserList.length > 0 ?
                                <>{renderUserList(stateUserList)}</>
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

export default AdminPanel;