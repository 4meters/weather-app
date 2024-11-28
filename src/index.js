import React from "react";
import ReactDOM from "react-dom";

import "leaflet/dist/leaflet.css";
import "./index.scss";

import AppRoutes from "./AppRoutes"
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => <AppRoutes/>;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

serviceWorkerRegistration.register();
