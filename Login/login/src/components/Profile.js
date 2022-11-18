import React,{useState,useEffect} from 'react';
import NavBar from './NavBar'
import {useNavigate} from 'react-router-dom'
import { deepPurple } from '@mui/material/colors';

const Profile = () =>{
    const navigate = new useNavigate()
    const [userData,setUserData] = useState();
    const [userToggle,setUserToggle] = useState(1)
    const [imgData,setImgData] = useState(null)
    const [nUsers,setNUsers] = useState(0)
    async function fetchData(){
       // console.log("fetch data is called")
        try{
            const res = await fetch('/profile',{
                 method:"GET"
                // headers:{
                //     Accept:"application/json",
                //     "Content-Type":"application/json"
                // },
                // credentials:"include"
            })
        //console.log(res.status)
        const data = await res.json()
        //console.log(data)

         setUserData(data)
         if(res.status === 422){
             navigate('/errorProfile')
             return res.json();
            }
            if(data.image){
                getImage()
            }
            
    }catch(error){
           console.log("Error is ",error)
        }
       
        
         //setStatus(res.status)
     }
    
    // function hexToBase64(str) {
    //     return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    // }
     async function getImage(){
        console.log(`req for getting image is called`)
        fetch('/photos')
        .then(res=>res.json())
        .then(res=>{
            console.log(res.image)
            const tarun = res.image.toString('base64')
            console.log(tarun)
            if(res.image)
            setImgData(res.image.data)
        })
        // try{const img_data = await fetch('/photos',{
        //     method: "GET",
        // })
        // if(img_data.status === 200){
        // setImgData(img_data)
        //window.location.reload()
    
    // }}
    .catch(error=>{
            console.log(`error while getting image ${error}`)
        })
     }
   
     async function sentData(){
        try{
        const no_users =  await fetch('/users',{
            method:'GET',
            headers:{
                Accept:"application/json",
                "Content-Type": "application/json"
            }
        })
        if(no_users.status === 200){
           console.log(no_users)
        setNUsers(no_users.json())}
    }catch(error){
            console.log(error)
        }
     }
     useEffect(() => {
         fetchData();
         sentData()
        
    },[])

    async function sendImg(){
       
        var input = document.querySelector('input[type="file"]')
        console.log(input.files[0])
        try{
            var data = new FormData()
            data.append('file',input.files[0])
            const res  = await fetch('/photos',{
            method:"POST",
            body:data
        })
        console.log(res.status)
        if(res.status === 200){
            console.log("Image is saved into database successfully")
            await getImage()
            //  window.location.reload();
        }}catch(err){
            console.log(`error in saving image into db ${err}`)
        }
        
    }
    async function setTimeline(prop){
        const time = await prop.time;
        console.log(time)
       const day = document.getElementById('day')
       const hrs = document.getElementById('hrs')
       const min = document.getElementById('min')
           console.log(min)
       if(time/60000){
           min.value = Math.floor(time/60000)
           if(min.value <10){
           min.innerText = "0"+Math.floor(time/60000)}
           else{
               min.innerText = Math.floor(time/60000)}
           }

           if(min.value/60){
               hrs.value = Math.floor((min.value)/60);
               if(hrs.value < 10){hrs.innerText = "0"+ Math.floor((min.value)/60);}
               else{hrs.innerText = Math.floor((min.value)/60);}
               min.innerText = Math.floor((min.value)-((hrs.value)*60))
               if(hrs.value/24){
                   day.value  = Math.floor((hrs.value)/24);
                   if(day.value<10){day.innerText = "0"+ Math.floor((hrs.value)/24);}
                   else{day.innerText =  Math.floor((hrs.value)/24);}
                   hrs.value = Math.floor(hrs.value-((day.value)*24))
                   if(hrs.value <10){hrs.innerText = "0"+ Math.floor(hrs.value-((day.value)*24))}
                   else{hrs.innerText = Math.floor(hrs.value-((day.value)*24))}
               }
           }
       }
      
    
    return(
        <>
        <NavBar/>
        {userData && <div className='container emp-profile' style={{marginTop:'75px'}}>
            <form method="" style={{jusifyContent:'center'}}>
                <div className='row'>
                    <div className='col-md-4'>
                       <div>{
                       (imgData) ?
                        <img id="img" src = {`data:image/jpeg;base64,${imgData}`}  alt="Upload Your Image" style={{width:'35%',height:'35%',borderRadius:"25px"}}/>
                        : 
                         <div style={{alignItem:"center"}}><div encType='multipart/form-data'><input name='file' id='fileInput' type="file"/><button type="Submit" className="btn btn-primary" style={{marginTop:"5px"}} onClick={(e)=>{
                            e.preventDefault();
                            sendImg()}}
                         >Submit</button></div></div>
                         
                         }</div> 
                    </div>
                   {userData && <div className='col-md-6'>
                        <div className='profile-head'>
                           { userData !== '' && <h5>{userData.lastName + " "+userData.firstName}</h5>}
                            <h6>Useless</h6>
                            <p className='profile-rating mt-3 mb-5'>RANKINGS <span>2</span><span>/</span><span>{nUsers}</span></p>
                            <ul className="nav nav-tabs" style={{marginBottom:'30px'}}>
                            <li className="active" style={{marginLeft:'50px'}} onClick={()=>{setUserToggle(1)}}><a href="#home"  style={{color:'black',textDecoration:"none","&:hover":{color:"white"}}} data-toggle="tab">Details</a></li>
                            <li style={{marginLeft:'50px'}} onClick={()=>{
                                setUserToggle(2)
                                setTimeline(userData)}}><a href="#profile" style={{color:'black',textDecoration:"none"}} data-toggle="tab">TimeLine</a></li>
                                
                            </ul>
                        <hr/>
                        </div>
                    </div>}
                    <div className='col-md-2'>
                        <input type="submit" className='profile-edit-btn' value='Edit Profile'/>
                    </div>
                        
                </div>
                    
                <div className='row'>
                    <div className='col-md-4'>
                        <div className='profile-work'>
                            <p>My Works</p>
                            <a href="https://www.linkedin.com/in/tarun-garlapati-4b32ba240"  target="_blank" rel="noreferrer" style={{textDecoration:'none',color:'black'}} >LinkedIn</a><br/>
                            <a href="https://github.com/GTARUN98/"  target="_blank"  rel="noreferrer" style={{textDecoration:'none',color:'black'}}>GitHub</a><br/>
                            <a href="https://www.google.com"  target="_blank" rel="noreferrer" style={{textDecoration:'none',color:'black'}}>Instagram</a><br/>
                            <a href="https://drive.google.com/file/d/1t3V3-5ZINjYn3Cyi5PL0dksYqLyDhcOP/view?usp=share_link" target="blank" rel="noreferrer" style={{textDecoration:'none',color:'black'}}>Resume</a><br/>
                            <br/>
                            <a href="#" style={{textDecoration:'none',color:'black'}}>HIRE ME!</a><br/>
                        </div>
                    </div>
                    <div className='col-md-8 pl-5 about-info'>
                        <div className='tab-content profile-tab' id='myTabContent' >
                       {userData   && userToggle===1 && <div className='tab-pane fade show active' id="home" role="tabpanel" aria-labelledby='home-tab'>
                                <div className='row'>
                                <div className='col-md-6'>
                                <label>USER ID</label>
                                </div>
                                <div className='col-md-6'>
                                { userData !== '' &&   <label>{userData._id}</label>}
                                </div>
                                </div>
                                <div className='row mt-3'>
                                <div className='col-md-6'>
                                <label>Name</label>
                                </div>
                                <div className='col-md-6'>
                                    <label>{userData.firstName}</label>
                                </div>
                                </div>
                                <div className='row mt-3'>
                                <div className='col-md-6'>
                                <label>Email Id</label>
                                </div>
                                <div className='col-md-6'>
                                    <label>{userData.email}</label>
                                </div>
                                </div>
                                <div className='row mt-3'>
                                <div className='col-md-6'>
                                <label>Total WPM</label>
                                </div>
                                <div className='col-md-6'>
                                    <label>{userData.WPM}</label>
                                </div>
                                </div>
                                <div className='row mt-3'>
                                <div className='col-md-6'>
                                <label>Total Accuracy</label>
                                </div>
                                <div className='col-md-6'>
                                    <label>{userData.accuracy}</label>
                                </div>
                                </div>
                            </div>}
                            {
                            userData && userToggle===2 &&  <div className='tab-pane fade show active' id="profile"  aria-labelledby='profile-tab'>
                                <div className='row'>
                                <div className='col-md-6'>
                                <label>Total Typing Time</label>
                                </div>
                                <div className='col-md-6'>
                                    <label><span id='day' style={{marginRight:"4px"}}>00</span><span style={{marginRight:"4px"}}>Day</span><span id='hrs'style={{marginRight:"4px"}}>00</span><span style={{marginRight:"4px"}}>Hrs</span><span id="min" style={{marginRight:"4px"}}>00</span><span>Min</span></label>
                                </div>
                                </div>
                                
                                <div className='row mt-3'>
                                <div className='col-md-6'>
                                <label>No Of Words Typed </label>
                                </div>
                                <div className='col-md-6'>
                                    <label>{userData.words}</label>
                                </div>
                                </div>
                                
                            </div>}
                        </div>
                    </div>
                </div>
            </form>
        </div>}
        </>
    )
                            }
     

export default Profile
