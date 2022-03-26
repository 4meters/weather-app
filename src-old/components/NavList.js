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
              title: 'Map',
              itemId: '/',
              // you can use your own custom Icon component as well
              // icon is optional
              elemBefore: () => <></>,
            },
            {
              title: 'Login',
              itemId: '/login',
              elemBefore: () => <></>,
            },
            {
              title: 'Add-station',
              itemId: '/add-station',
              elemBefore: () => <></>,
            },
          ]}
        />
      </>
    );
}
export default NavList;