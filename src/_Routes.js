import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Map from "./components/Map";
import Login from "./components/Login";
import Register from  "./components/Register";
import AddStation from "./components/AddStation"
import AddStationOnMap from "./components/AddStationOnMap"
import ArchivalData from "./components/ArchivalData";
import UserStationList from "./components/UserStationList"
import AdminPanel from "./components/AdminPanel";
import ConfigureStation from "./components/ConfigureStation";

class _Routes extends React.Component{
    render(){
        return(
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Routes>
                    <Route path="/" element={<Map/>}>
                    </Route>
                    <Route path="/login" element={<Login/>}>
                    </Route>
                    <Route path="/register" element={<Register/>}>
                    </Route>
                    <Route path="/add-station" element={<AddStation/>}>
                    </Route>
                    <Route path="/add-station-on-map" element={<AddStationOnMap/>}>
                    </Route>
                    <Route path="/station-list" element={<UserStationList/>}>
                    </Route>
                    <Route path="/archival-data" element={<ArchivalData/>}>
                    </Route>
                    <Route path="/admin-panel" element={<AdminPanel/>}>
                    </Route>
                    <Route path="/configure-station" element={<ConfigureStation/>}>
                    </Route>
                </Routes>
            </BrowserRouter>
        )
    }
}
export default _Routes;