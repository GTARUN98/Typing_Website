import React,{useState} from 'react';
import { Box,Grid,Container,Typography,TextField,Button,styled } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () =>{
    const [email,setEmail] = useState('');
    const navigate = useNavigate();
const sendEmail = async(e) =>{
e.preventDefault();
const res = await fetch('/forgotPassword',{
    method:'POST',
    headers:{
        "Content-Type" : "application/json"
      },
      body:JSON.stringify({
        email })
})
if(res.status === 200){
    navigate('/login')
}
else{
    console.log(`status of response in forgot password is ${res.status}`)
}
}

return(

    <Container maxWidth="xs" style={{marginTop:'4',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh'}}>
        <Typography  >Forgot Password</Typography>
        <Box style={{marginTop:'15px'}}>
        
            
                <TextField
                name='email'
                id='email'
                required
                fullWidth
                label='Email'
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}/>
                
         
        <Button variant="contained"
        fullWidth
        onClick={sendEmail}
        style={{marginTop:"15px",marginBottom:"3px",onClick:{sendEmail}}}>Send Email</Button>

         

    </Box>
    </Container>
)
}
export default ForgotPassword;