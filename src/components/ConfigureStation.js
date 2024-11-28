import React from "react";

import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import SideMenu from "./nav/SideMenu";
import Header from "./styling-components/Header";


function ConfigureStation(props) {


    return (
        <>
            <div>
                <SideMenu/>
            </div>

            <div className="content-padding">
                <Header headerText="Konfiguracja stacji"/>
                <p>Aby skonfigurować połączenie
                    WiFi w stacji pogodowej, połącz się z siecią o nazwie <b>Konfiguracja Wifi 1.1</b>,
                    a następnie przejdź pod adres:</p>
                <a href="http://10.0.0.1">http://10.0.0.1</a>
                <p>Wybierz sieć, z którą chcesz się połączyć i wprowadź hasło.</p>
                <p>Po restarcie urządzenie powinno się połączyć z siecią.</p>
                <p style={{marginTop: "30px"}}>W razie niepowodzenia konfiguracji lub chęci zmiany punktu dostępowego,
                    można zrestować konfiguracje za pomocą przycisku umieszczonego na obudowie.</p>

            </div>

        </>
    )
}

export default ConfigureStation;

