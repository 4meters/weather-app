import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Map from "./components/Map";
import Login from "./components/Login";
import Register from  "./components/Register";
import AddStation from "./components/AddStation"
import AddStationOnMap from "./components/AddStationOnMap"
import Statistics from "./components/Statistics";
import UserStationList from "./components/UserStationList"

class _Routes extends React.Component{
    render(){
        return(
            <BrowserRouter>
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
                    <Route path="/statistics" element={<Statistics/>}>
                    </Route>
                </Routes>
            </BrowserRouter>
        )
    }
}
export default _Routes;