import React from 'react';

import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

import { useNavigate, useLocation } from "react-router-dom";

function NavList() {

  const navigate = useNavigate();
  const location = useLocation();

    return (
      <>
        <Navigation
          activeItemId={location.pathname}
          onSelect={({itemId}) => {
            navigate(itemId);
          }}
          items={[
            {
              title: 'Mapa',
              itemId: '/',
              elemBefore: () => <></>,
            },
            {
              title: 'Logowanie',
              itemId: '/login',
              elemBefore: () => <></>,
            },
            {
              title: 'Lista stacji',
              itemId: '/station-list',
              elemBefore: () => <></>,
            },
            {
              title: 'Dodaj stację',
              itemId: '/add-station',
              elemBefore: () => <></>,
            },
            {
              title: 'Dane archiwalne',
              itemId: '/archival-data',
              elemBefore: () => <></>,
            },
            {
              title: 'Konfiguracja stacji',
              itemId: '/configure-station',
              elemBefore: () => <></>,
            },
            {
              title: 'Panel administracyjny',
              itemId: '/admin-panel',
              elemBefore: () => <></>,
            },
          ]}
        />
      </>
    );
}
export default NavList;