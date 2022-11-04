const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
require("dotenv").config()//required for importing and using the keys in .env
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

//hashing to save the password 
//this keyword cannot be used for arrow function
userSchema.pre('save',async function(next) {//means befor .save method its goinng to be called
    
    if(this.isModified('password')){//if password is modified then only hashin takes place
        console.log("hello from inside bcrypt")
        this.password = await bcrypt.hash(this.password,12)
    }
    next()
})

userSchema.methods.generateAuthToken = async function(){
    try{
        console.log("SECRET_KEY is" )
        let tokenGenerated =  jwt.sign({_id:this._id},process.env.REACT_APP_SECRET_KEY)//as id is unique
        this.tokens = this.tokens.concat({token:tokenGenerated})//adding in token object of tokens
        const isSaved = await this.save();
        if(isSaved){
            console.log("token generated and added");
            
        }else{
            console.log("something wrong with token generation");
        }
        return tokenGenerated;
     }catch(error){
        console.log(error)
    }
}

const Register = new mongoose.model("Register",userSchema)
module.exports = Register//Register is the collection name