import NavList from "./NavList";
import React from "react";

import { slide as BurgerMenu } from 'react-burger-menu'
import "./SideMenu.scss"

function SideMenu() {
    return (
        <div className="navbar">
            <BurgerMenu>
                <NavList className="navlist-padding"/>
            </BurgerMenu>
        </div>
    )
}

export default SideMenu;