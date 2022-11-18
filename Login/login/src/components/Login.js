import React,{useState} from 'react';
import { Box,Grid,Container,Typography,TextField,Button,styled } from '@mui/material'
import {useNavigate} from 'react-router-dom'

//xs-extra small
//sm small
//md medium


const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate()

  const loginUser = async(e) =>{
  
    e.preventDefault();
    const res = await fetch('/login',{
      method: 'POST',
    headers:{
      "Content-Type" : "application/json"
    },
    body:JSON.stringify({
      email,password
    })
  })
  console.log("data is sent through fetch api to check wheather true or not ")
  console.log( res.status)
  if(res.status === 200){
    console.log("status is 200 successfully done fetch api")
    navigate('/homePage')
  
  }}
  const goToForgotPassword = (e) =>{
    e.preventDefault()
     navigate('/forgotPassword')
  }
  
  return (
    
    <Container maxWidth="xs" style={{marginTop:'4',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
        <Typography  >Login</Typography>
        <Box style={{marginTop:'15px'}}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                name='email'
                id='email'
                required
                fullWidth
                label='Email'
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                name='password'
                id='password'
                required
                fullWidth
                label='Password'
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                />
            </Grid>
        </Grid>
        <Button variant="contained"
        fullWidth
        onClick={loginUser}
        style={{marginTop:"15px",marginBottom:"3px"}}>Login</Button>
         <Typography onClick={goToForgotPassword} style={{textAlign:"right",marginTop:"4px",cursor:"pointer"}}>Forgot Password?</Typography>
         <div onClick={(e)=>{
          e.preventDefault();
          navigate('/register')}}><Typography  style={{textAlign:"center",marginTop:"10px",cursor:"pointer"}}>Not Registered?Register Here</Typography></div>
        <Button variant="contained"
        fullWidth
        onClick={(e)=>{
          e.preventDefault()
          navigate('/homePage')
        }}
        style={{marginTop:"15px",marginBottom:"3px"}}>Guest Login</Button>
    </Box>
    </Container>
    
  )
}

  export default Login;