import React from "react";
import NavBar from './NavBar'
const Error_ProfilePage = () =>{
    return(
        <>
        <NavBar/>
        <div style={{marginTop:'100px'}}>
        <div class="d-flex justify-content-center align-items-center" id="main">
    <h1 class="mr-3 pr-3 align-top border-right inline-block align-content-center">404</h1>
    <div class="inline-block align-middle">
    	<h2 class="font-weight-normal lead" id="desc">Profile Page Not Found Because You have Joined As Guest.Please LogIn</h2>
    </div>
</div></div></>
    )
}
export default Error_ProfilePage