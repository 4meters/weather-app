import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";

import "leaflet/dist/leaflet.css";
import "./index.scss";

import AppRoutes from "./AppRoutes"
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";

let updateAvailableCallback;

function App({ setUpdateAvailableCallback }) {
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        // Pass the callback to update the state
        setUpdateAvailableCallback(() => {
            setUpdateAvailable(true);
        });
    }, [setUpdateAvailableCallback]);

    useEffect(()=> {
        setInterval(() => serviceWorkerRegistration.forceSWupdate(), 1000 * 60 * 1);
    }, [])

    const handleUpdate = () => {
        // Reload the page when the user clicks "Refresh"
        window.location.reload();
    };

    return <>
        {updateAvailable && <div className="update-bar"><Button size="sm" onClick={handleUpdate}>Uaktualnij</Button></div>}
        <AppRoutes/>
    </>;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App setUpdateAvailableCallback={cb => (updateAvailableCallback = cb)}/>, rootElement);

serviceWorkerRegistration.register({
    onUpdate: () => {
        if (updateAvailableCallback) {
            updateAvailableCallback();
        }
    },
});
