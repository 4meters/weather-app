import React from "react";

import NavList from "./NavList";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';


function ConfigureStation(props) {


 return (
    <>   
<div>
  <NavList/>
</div>

        <div>
          <h1>Konfiguracja stacji</h1>
          <hr style={{marginTop:"-20px", marginBottom:"0px"}}/>
          <p>Aby skonfigurować połączenie 
            WiFi w stacji pogodowej, połącz się z siecią o nazwie <b>Konfiguracja Wifi 1.1</b>,
            a następnie przejdź pod adres:</p>
            <a href="http://10.0.0.1">http://10.0.0.1</a>
            <p>Wybierz sieć, z którą chcesz się połączyć i wprowadź hasło.</p>
            <p>Po restarcie urządzenie powinno się połączyć z siecią.</p>
            <p style={{marginTop:"30px"}}>W razie niepowodzenia konfiguracji lub chęci zmiany punktu dostępowego, można zrestować konfiguracje za pomocą przycisku umieszczonego na obudowie.</p>
          
        </div>

    </>
  )
}

export default ConfigureStation;

