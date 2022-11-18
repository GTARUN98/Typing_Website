var express  = require("express")
var bodyParser  = require("body-parser")
var mongoose  = require("mongoose")
const Register = require("./model/userSchema")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer  = require('multer')
const cookieParser =  require('cookie-parser')
const auth = require('./middleware/auth')
const nodemailer = require('nodemailer')//for sending emails
const fs = require('fs')//importing filesystems
require("dotenv").config()//required for importing and using the keys in .env



const app = express() 

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))
const mongoUrl = process.env.REACT_APP_MONGO_DB_URL.toString()
//console.log(`rthe mongo db url is ${mongoUrl}`)
mongoose.connect(mongoUrl)
var db = mongoose.connection;

db.on('error',() =>{console.log("error in connection with database")})
db.once('open',()=>{console.log("Connected to database")})

app.get("/",(req,res)=>{
    // res.send("Hello from server")
    res.set({
        "Allow-access-Allow-Origin" : "*"
       // "Access-control-allow-origin" : "*"
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
    const registerUser  =  new Register({firstName,lastName,email,password,cpassword,accuracy:"0",WPM:"0",time:"0",correct:"0",wrong:"0",length:"0",words:"0"})
    
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
    
    app.post('/forgotPassword',async(req,res)=>{
        try{
            const body_email = req.body.email;
            const isUserThere = await  Register.findOne({email:body_email})
            if(isUserThere){
                const userPassword = isUserThere.cpassword;
                var transporter  = nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:process.env.REACT_APP_USEREMAIL,
                        pass:process.env.REACT_APP_NODEMAILER_PASSWORD
                    },
                    tls: {
                        rejectUnauthorized: false
                      }
                });
                var mailOptions={
                    from:process.env.REACT_APP_USEREMAIL,
                    to:body_email,
                    subject:'Forgot Password',
                    text:` Your Password is ${userPassword} please delete this message after reading !! Dont't Forward it !!`
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
    app.get('/homePage',auth,async (req,res)=>{
        res.status(200).json("home page is authorized")
    
        console.log(`This is my cookie ${req.cookies.jwtoken} and im in home page`)}, 
        )
    app.get('/profile',auth,async (req,res)=>{
        const token = req.cookies.jwtoken;
        const verifyUser = await jwt.verify(token,process.env.REACT_APP_SECRET_KEY)
        const user = await Register.findOne({_id:verifyUser._id,"tokens:token":token})
        console.log(user)
        res.status(200).json(user)
    
        console.log(`This is my cookie ${req.cookies.jwtoken} and im in profile page`)}, 
        )
    app.post('/results',async(req,res)=>{
        try{console.log("results api is called")
        const token = req.cookies.jwtoken;
        const verifyUser = await jwt.verify(token,process.env.REACT_APP_SECRET_KEY)
        const user = await Register.findOne({_id:verifyUser._id,"tokens:token":token})
        var words = req.body.words
        var time = req.body.time
        var correct = req.body.correct
        var wrong = req.body.wrong
        var length = req.body.length
        // var accuracy = req.body.accuracy
        


        var new_words =(parseInt(user.words) + words).toString()
        var new_time = (parseInt(user.time) + time).toString()
        var new_correct = (parseInt(user.correct) + correct).toString()
        var new_wrong = (parseInt(user.wrong) + wrong).toString()
        var new_length = (parseInt(user.length) + length).toString()
        
        
        var val_new_accuracy = ((parseInt(new_correct)/parseInt(new_length))*100).toFixed(2)
        var new_accuracy = (val_new_accuracy).toString();
        new_accuracy += "%";
        var val_new_WPM = ((parseInt(new_length)*12000)/(parseInt(new_time))).toFixed(2)
        var new_WPM = (val_new_WPM).toString();
        console.log(new_accuracy,new_WPM)
        
        const what =  await Register.findOneAndUpdate({_id:user._id},{$set:{words:new_words,accuracy:new_accuracy,correct:new_correct,wrong:new_wrong,length:new_length,time:new_time,WPM:new_WPM}})
        //console.log(user.accuracy+" "+user.WPM+" "+length)
       // console.log(what)

        res.status(200).json("results are Updated")}catch(error){console.log(error)}
        

    })
    app.use(express.json({limit: "100mb", extended: true}))
    app.use(express.urlencoded({limit: "100mb", extended: true, parameterLimit: 50000}))
    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{//where is the end desination
            cb(null,'./uploads')//error is null and end destination where its stored is uploads folder
        },
        filename:(req,file,cb)=>{//what should be the filename
            cb(null,file.originalname)//as there are not going to be much users we are setting it to original name
        }
    })
    const upload = multer({storage:storage,
    limits:{fileSize:10000000}
    });//coz its a single file name of input is file
    // var router = express.Router()
    app.post('/photos',upload.single('file'),async(req,res)=>{
        console.log("photos post req is called")
        try{
            console.log(req)
            console.log("uploading image api is called")
            const token = req.cookies.jwtoken;
        const verifyUser = jwt.verify(token,process.env.REACT_APP_SECRET_KEY)
        const user = await Register.findOne({_id:verifyUser._id,"tokens:token":token})
        
        const upload_img = await Register.findOneAndUpdate({_id:user._id},{$set:{"image.data":fs.readFileSync('uploads/'+ req.file.filename),"image.contentType":"image/JPEG"}})
        console.log("image is updated")
        console.log(user)
        res.status(200).json("image is updated")}catch(error){console.log(`error in uploading image ${error}`)}
    })
    app.get('/photos',async(req,res)=>{
        const token  = req.cookies.jwtoken;
        const verifyUser = jwt.verify(token,process.env.REACT_APP_SECRET_KEY)
        const user = await Register.findOne({_id:verifyUser._id})
        //console.log("user image data is",user.image.data)
        // const buffer = Buffer.from(user.image.data,"base64")
        // console.log(user.image.data)
         console.log(user.image.data)
        //res.status(200).json(buffer)
        res.status(200).json({image:user.image.data})
    })
  const MongoClient = require("mongodb").MongoClient;
    app.get('/users',async(req,res)=>{
    //     const client = new MongoClient(process.env.REACT_APP_MONGO_DB_URL)
    //    console.log(client)
    //     const database = client.registers.count()
    //     const nUsers = database.count()
    //   console.log(nUsers)
    //   res.status(200).json(nUsers)
    })

        

console.log("Listening on PORT 3000")