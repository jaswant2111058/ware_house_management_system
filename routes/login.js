const express = require("express");
const router = express.Router();
const schema = require("../model/schema")
const session = require('express-session');
router.use(express.json());
router.use(express.urlencoded({extended:false}));
const cookie = require("cookie-parser");
const bodyParser= require("body-parser")
const jwt = require("jsonwebtoken");
const key = process.env.SESSION_SECRET;
const time = 1000*15*60;
router.use(cookie());
router.use(bodyParser.urlencoded({ extended: true }));
const sendmail = require("../nodemailer/mailer")
const otp =""


router.get("/",(req,res)=>{

  res.render("login")
})


//signup get

router.get("/signup",(req,res)=>{

res.render("signup")
})


//signup post

router.post('/signup',async(req,res)=>{
      
//
try{
  const email=await schema.findOne({email:req.body.email})
  console.log(email)
  if(email){
      res.send("email is all ready register"+"<html><br><br><a href='/'>return<a></html>")
  }
  else{
  const pass = req.body.password;
  const otp=sendmail(req.body.email);
  const detail ={email:req.body.email,password:pass,name:req.body.username,email_status:false,otp:otp}
  
    const usr= new schema(detail)
    const adnew = await usr.save();
  
    res.render("otpverification",{email:req.body.email})
    console.log(otp)
   // res.send("yes")
  }
     }
  catch
  {
    res.status(400).send("something went wrong"+"<html><br><br><a href='/'>return<a></html>");
  }

 
})


//otp verification

router.post("/otpverification",async(req,res)=>{


  const email= await schema.findOne({email:req.body.email})
    if(email.otp==req.body.otp)
    {
      await schema.updateOne({email:req.body.email},{email_status:true,product_detail:[]});
      res.redirect("/")
    }
    else
    {
      res.send("otp is not matching")

    }

})


//login post

router.post("/login", async (req, res) => {

try {
    const lemail = req.body.email
    const lpassword = req.body.password

    const semail = await schema.findOne({ email: lemail })
    if(semail&& semail.email_status===true)
    {
   

    if (lpassword!=semail.password) {

        res.send( "password not match" );
    }
    else {
            const token = jwt.sign({email:semail.email,id:semail._id},key)
            res.cookie("token", token, {
            expires: new Date(Date.now() + time),
              httpOnly: true})
              console.log(token);
              res.redirect("/user_logged_in")    
    }
  }
  else
  res.send("Email is not register"+"<html><br><br><a href='/'>signup<a></html>")
}

catch (e) {
    res.status(400).send(e);
}
})


//forget password get

router.get("/forgetpassword",(req,res)=>{

res.render("forgetpassword");

})


// forget password post

router.post("/forgetpassword",async(req,res)=>{
const semail = await schema.findOne({ email: req.body.email })
if(!semail)
{
res.send("Email is not register"+"<html><br><br><a href='/'>signup<a></html>")
}
else
{
  const otp = sendmail(req.body.email);
  await schema.updateOne({email:req.body.email },{otp:otp})

res.render("fov",{email:req.body.email})
}

})


//forget password otp verification

router.post("/fov",async(req,res)=>{

     
  const email= schema.findOne(req.body.email)
  if(email.otp==req.body.otp)
  {
    await schema.updateOne({email:req.body.email},{email_status:true,password:req.body.password});
    res.redirect("/")
  }
  else
  {
    res.send("otp is not matching")

  }


})

module.exports = router;
