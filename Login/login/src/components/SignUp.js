import React, { useState } from 'react';
import { Box,Grid,Container,Typography,TextField,Button,styled } from '@mui/material'
import {useNavigate} from 'react-router-dom'

//xs-extra small
//sm small
//md medium
const SignUp = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        cpassword:""
        
    })
    let name,value  //here we require 2 things the the data written in input field and that data belongs to which input field
    const handleInputs = (e) =>{//in the event e
        name = e.target.name;
        value = e.target.value;
        
        setUser({...user,[name]:value})//not able to understand spread function clearly but jo bhi user required data hai use maine require karliya here [] depict the dynamic name i.e, for email event.target.name as name="email" is not name its email
    }
    
    const PostData = async(e) =>{
      
        e.preventDefault() //so that the form does'nt get reloaded
        const {firstName,lastName,email,password,cpassword} = user    //this is called objectdestructuring every time we should no send like user.name so we can send like this alla t once
        const res = await fetch("/register",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({//server does'nt undestand json dat so we have tostringify it
                firstName,lastName,email,password,cpassword
            }),
        })
        // window.alert("Registration successfull")
        console.log(" for sending request done successfully"+res.status)
        
        if(res.status === 200){
            console.log("status is 200 successfully done fetch api")
            navigate('/login')
        }
        else{
            console.log("status is 422 sorry given by fetch api")

        }
    }
    
    const goToLogin = (e) =>{
        navigate('/login')
    }
    
    return (
        
    <Container maxWidth="xs" style={{marginTop:'4',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
        <Typography  >Sign Up</Typography>
        <Box style={{marginTop:'15px'}}>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                name='firstName'
                id='firstName'
                required
                fullWidth
                label='First Name'
                onChange={handleInputs}
                value={user.firstName}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                name='lastName'
                id='lastName'
                required
                fullWidth
                label='Last Name'
                onChange={handleInputs}
                value={user.lastName}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                name='email'
                id='email'
                required
                fullWidth
                label='Email'
                onChange={handleInputs}
                value={user.email}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                name='password'
                id='password'
                type="password"
                required
                fullWidth
                label='Password'
                onChange={handleInputs}
                value={user.password}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                name='cpassword'
                id='cpassword'
                required
                fullWidth
                label='ConfirmPassword'
                onChange={handleInputs}
                value={user.cpassword}
                />
            </Grid>
        </Grid>
        <Button variant="contained"
        fullWidth
        onClick={PostData}
        style={{marginTop:"15px",marginBottom:"3px"}}>Register</Button>
            <Typography style={{textAlign:"right",marginTop:"4px",cursor:"pointer"}} onClick={goToLogin}>Already Registered?Login</Typography>

    </Box>
    </Container>
    
  )
}
  export default SignUp;
