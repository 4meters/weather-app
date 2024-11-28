import React from 'react'

function Header({headerText}) {
    return <>
        <h1>{headerText}</h1>
        <hr style={{marginTop: "0px"}}/>
    </>
}

export default Header