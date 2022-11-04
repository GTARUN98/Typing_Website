var express  = require("express")
var bodyParser  = require("body-parser")
var mongoose  = require("mongoose")
const Register = require("./model/userSchema")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser =  require('cookie-parser')
const auth = require('./middleware/auth')
const nodemailer = require('nodemailer')//for sending emails
require("dotenv").config()//required for importing and using the keys in .env

const app = express() 
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb+srv://Login:mnxH298RIJ3B7VqX@cluster0.erffosw.mongodb.net/?retryWrites=true&w=majority')
var db = mongoose.connection;

db.on('error',() =>{console.log("error in connection with database")})
db.once('open',()=>{console.log("Connected to database")})

app.get("/",(req,res)=>{
    // res.send("Hello from server")
    res.set({
        "Allow-access-Allow-Origin" : "*"
    })
}).listen(3000);

// app.post("/register",(req,res)=>{
app.post("/register",async(req,res)=>{

    const {firstName,lastName,email,password,cpassword} = req.body;
    if( !firstName || !lastName || !email || !password || !cpassword){
        res.status(422).send("Please fill all the fields")
        console.log("Please fill all the fields");
    }
    if(password !== cpassword){
        res.status(422).send("Please make sure both passwords are same")
        console.log("Please make sure both passwords are same");

    }
    else{

    const userExist = await Register.findOne({email:email})
    if(userExist){
        console.log("User already exists")
        return res.status(422).json("email already exists")
    }
    const registerUser  =  new Register({firstName,lastName,email,password,cpassword})
    
    //here before saving hashing of the password is going to take place see in userShema using bcrypt
    
    const registered = await registerUser.save();
    console.log(registered)
    if(registered){
    console.log("added the data into mongo db successfully and given status 200")
    return res.status(200).json("sent requets 200")}else{
        console.log("unable to add data to mongodb")
    }


    // Register.findOne({email:email})     Using .then which is a little bit complicated so i used async await
    //     .then((userExist)=>{
    //         if(userExist){
    //             console.log("email already exist")
    //             return res.status(422).send("email already exist")
    //     }
    //     })
    //     const registerUser = new Register({firstName,lastName,email,password})

    //     registerUser.save().then(()=>{
    //         res.status(201).send("Registered susuccessfully")
    //         console.log("added in mongodb collection of Register")
    //     }).catch((error) => res.status(500).send("error while registering"));
    


    // const registerUser = new Register({
    //     firstName : req.body.firstName,
    //     lastName : req.body.lastName,
    //     email : req.body.email,
    //     password: req.body.password,
    // })
    // const registered = await registerUser.save();
    // console.log("Registered successfully in mongodb")

}})
app.get("/logout",async(req,res)=>{
    res.clearCookie('jwtoken',{path:"/"})
    console.log("cookie is cleared successfully")
    res.status(200).json("logged out")
})
app.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            console.log("please fill all the details")
            return res.status(422).json("please fill all the details")
        }
        const isUserExist = await Register.findOne({email:email})//Register is the name of the collections findOne is a mongoose method
        if(isUserExist){
            const isMatching = await bcrypt.compare(password,isUserExist.password)
            if(isMatching){
                //console.log("user sign in successfully")
                
                const token = await isUserExist.generateAuthToken()//we are now generating auth token that is in userSchema
                //console.log("token",token)
                res.cookie("jwtoken",token,{
                    maxAge:2592000000,//token is active for 2592000000 millisec ie 30 days after that he will be logged out expires is not working please take a note
                    httpOnly:true
                }).status(200).end()
                // res.status(200).json("user sign in successfully")
            }else{
                console.log("user cannot sign i email is theren ",isMatching)
                res.status(422).json("user cannot sign in")
                
            }}else{
                console.log("user cannot sign in email not there")
                res.status(422).json("user cannot sign in")
                
            }
            //console.log("user exist",isUserExist)//gives data in json format of the collectin with given email id
            
        }catch(error){console.log(error)}
    });
    
    app.get('/homePage',auth,async (req,res)=>{
    
    console.log(`This is my cookie ${req.cookies.jwtoken} and im in home page`)},
    
    app.post('/forgotPassword',async(req,res)=>{
        try{
            const body_email = req.body.email;
            const isUserThere = await  Register.findOne({email:body_email})
            if(isUserThere){
                const userPassword = isUserThere.password;
                var transporter  = nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:process.env.REACT_APP_USEREMAIL,
                        pass:process.env.REACT_APP_PASSWORD
                    },
                    tls: {
                        rejectUnauthorized: false
                      }
                });
                var mailOptions={
                    from:process.env.REACT_APP_USEREMAIL,
                    to:body_email,
                    subject:'Forgot Password',
                    text:` Your Password is ${userPassword}`
                };
                transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error)
                    }else{
                        console.log('Email is sent',info.response);
                    }
                })
                res.status(200).json("password sent to email succcessfully")
            }

        }catch(error){
            console.log(`user  not found ${error}`)
            res.status(422).json(`user  not found ${error}`)
        }
    })
   
)

console.log("Listening on PORT 3000")