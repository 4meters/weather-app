/*import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/

import React from "react";
import ReactDOM from "react-dom";

import "leaflet/dist/leaflet.css";
import "./index.css";
import Map from "./components/Map";
import Chart from "./components/Chart"
import Login from "./components/Login"
import Register from "./components/Register"
import _Routes from "./_Routes"

const App = () => <_Routes />;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
