
const jwt  = require('jsonwebtoken')
const express = require('express')
const Register = require('../model/userSchema')
require("dotenv").config()//required for importing and using the keys in .env
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())

const auth = async (req,res,next) =>{
  
    try{
        
        const token = req.cookies.jwtoken;
        console.log(`token from page is ${token}`)
    const verifyUser = await jwt.verify(token,process.env.REACT_APP_SECRET_KEY)

    console.log(`verify user ${verifyUser}`)
    //every time a token is generated a _id is also made along with it see in mongodb collections with  which we cann access every thing data of that particular user
    const user = await Register.findOne({_id:verifyUser._id,"tokens:token":token})
    //console.log(`Data of the user is  ${user} done by cookie token authentication`)// this gives the total data of the current user
    
    console.log(`Data of user is ${user}`)
    req.token = token;
    req.user = user
    next();

    }catch(error){
        
        console.log(`error while verifying token cookie ${error}`)
        res.status(422).json("error while verifying token cookie")
    }

}
module.exports = auth
