import React,{useState,useEffect} from 'react';
import NavBar from './NavBar'
import {useNavigate} from 'react-router-dom'
import { Box,Grid,Container,Typography,TextField,Button,styled } from '@mui/material'

const ContactPage = () =>{
    const navigate = new useNavigate()
    async function isAuthorized(){
        // console.log("fetch data is called")
         try{
             const res = await fetch('/profile')
         if(res.status === 422){
             navigate('/errorContact')
             return res.json();
         }}catch(error){
            console.log("Error is ",error)
         }
      }



    useEffect(() => {
        // console.log("use effect is called")
          isAuthorized();
     },[])




    return(
        <>
    <NavBar/>
    <Container maxWidth="xs" style={{marginTop:'4',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',ustifyContent:'center',height:'100vh'}}>
        <form action="https://formspree.io/f/mqkjgvww" method='POST'>
        <Box style={{marginTop:'125px',alignItems:'center',justifyContent:'center'}}>
        <Typography style={{marginBottom:"25px"}} >Contact Us</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                name='username'
                id='userName'
                required
                fullWidth
                label='User Name'
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                name='email'
                id='email'
                required
                fullWidth
                label='Email'
                />
            </Grid>
            <Grid item xs={12}>
            <TextField name='message'
            fullWidth label="Write Your Message Here...." id="fullWidth" multiline rows={7} 
    /></Grid>
        </Grid>
        <Button variant="contained" type='Submit'
        style={{marginTop:"15px",marginBottom:"3px",alignItems:"center"}}>Send</Button>
         

    </Box></form>
    </Container>
    </>
    )
}
export default ContactPage;