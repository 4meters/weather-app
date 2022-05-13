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
          // you can use your own router's api to get pathname
          activeItemId={location.pathname}
          onSelect={({itemId}) => {
            navigate(itemId);
          }}
          items={[
            {
              title: 'Mapa',
              itemId: '/',
              // you can use your own custom Icon component as well
              // icon is optional
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
          ]}
        />
      </>
    );
}
export default NavList;