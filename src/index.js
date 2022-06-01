import React from "react";
import ReactDOM from "react-dom";

import "leaflet/dist/leaflet.css";
import "./index.css";

import _Routes from "./_Routes"
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const App = () => <_Routes />;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

serviceWorkerRegistration.register();
