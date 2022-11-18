import React from "react";
import {Box, Typography} from '@mui/material'
import {useNavigate} from 'react-router-dom'

const NavBar  = () =>{
    const navigate = useNavigate();
    const userLogout = async() => {
        const response = await fetch('/logout')
        if(response.status === 200){
            console.log(`successfully logged out`)
            navigate('/login')
        }
        else{
            console.log(`Trouble in logging out`)

        }
    }
    const toNavigate = (e) =>{
         //console.log(e.target.attributes)
        //  console.log(e)
        var pathArray = window.location.pathname.split('/');

        const where = e.target.attributes["value"].value

        if(pathArray[pathArray.length -1]===where){
            window.location.reload()
        }else{
        console.log(where)
       navigate(`/${where}`)
        }
    }
    
      
    return(
        <Box style={{display:'flex',backgroundColor:'#4382e8'}}>
            <Typography style={{color:'white',padding:'15px',cursor:'pointer'}}>MyTyping</Typography>
            <Box id="main" style={{marginLeft:'auto',display:'flex'}}>
            <div className="nav-item"><Typography   onClick={toNavigate} value='homePage' style={{marginRight:'15px',color:'white',cursor:'pointer',padding:'15px'}}>HomePage</Typography></div>
            <Typography   value='contact' onClick={toNavigate} style={{marginRight:'15px',color:'white',cursor:'pointer',padding:'15px'}}>Contact Us</Typography>
            <Typography   onClick={toNavigate} value='profile' style={{marginRight:'15px',color:'white',cursor:'pointer',padding:'15px'}}>Profile</Typography>
            <Typography   onClick={userLogout} value='logout' style={{marginRight:'15px',color:'white',cursor:'pointer' ,padding:'15px'}}>Logout</Typography>
            </Box>
        </Box>
    )

}
export default NavBar;