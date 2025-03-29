const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const User=require('./models/User')
const bcrypt=require('bcryptjs')


const app=express()
const port=3000
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("DB connected")
).catch(
    (err)=>console.log(err)
)

//API LANDING PAGE http://localhost:3000/

app.get('/',async(req,res)=>{
    try{
        res.send("<h2 style='color:red;text-align:center'>API is working</h2>")
    }
    catch(err)
    {
        console.log(err)
    }
})

//API registeation PAGE http://localhost:3000/register
app.post('/register',async(req,res)=>{
    const {username,email,password}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,10)
        const newUser=new User({username,email,password:hashPassword})
        await newUser.save()
        console.log("New user is created....")
        res.json({message: "User Registred.."})
    }
    catch(err)
    {
        console.log(err)
    }
})




//API login http://localhost:3000/login
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) 
            {
             return res.status(400).json({ message: "Invalid Credentials" });
            }
          res.json({ message: "Login Successful", username: user.username });

    }
    catch(err)
    {
        console.log(err)
    }
})





app.listen(port,(err)=>{
    if (err) 
    {
        console.log(err)
    }
    console.log("server is running on port "+port)
})