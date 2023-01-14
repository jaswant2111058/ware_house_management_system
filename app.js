const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT||5000;
require('./auth');
app.set("view engine",'ejs');
const path = require("path");
require("./connection/conn");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const schema = require("./model/schema")
const static1 = path.join(__dirname,"/views")
app.use(express.static(static1));
const cookiejk = require("cookie-parser");
const bodyParser= require("body-parser")
const jwt = require("jsonwebtoken");
const key = process.env.SESSION_SECRET;
const time = 1000*15*60;
app.use(cookiejk());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
var nodemailer = require('nodemailer');
//const { config } = require('dotenv');
let otpsend =process.env.OTP;
let useremail=process.env.EMAIL;

//--------------------------mail sending function----------------------------------------
function sendmail( email)
{
   const random = Math.floor(Math.random() * 99999) + 10000;
  
  console.log(random);
 var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: "jkstar0123@gmail.com",
     pass: process.env.EMAIL_PASS,
   }
 })
 var mailOptions = {
  from: 'jkstar0123@gmail.com',
  to: `${email}`,
  subject: 'registor email verification',
  text: `OTP IS ${random}`
}
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
})
return random;
}

//------------------------------google passport-----------------------------------------//
app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));
app.use(session({ secret: "jassi", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
//--------------------------------------middleware------------------------------------------------//
function isLoggedIn(req, res, next) {
 
    if(req.user) {
      next()
    } else
    {
      try {
        let token = req.params.token || req.cookies.token;
        if (token) {
          let user = jwt.verify(token,key);
          if (user) {
            req.userid = user.id;
            req.useremail = user.email;
            
            next();
          }
          else
          {
            res.redirect("/")
          }
        } else
        {
          res.redirect("/")
        }
    
      } catch (err) {
        console.log(err);
        res.status(500);
        res.redirect("/");
      }
    }

    } 
  
//------------------------------google call back-----------------------------------------------//

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/googlelogin',
    failureRedirect: '/auth/google/failure'
  })
);


//------------------------------api-----------------------------------------------//


//login get

app.get("/",(req,res)=>{

        res.render("login")
})


//signup get

app.get("/signup",(req,res)=>{

  res.render("signup")
})


//signup post

    app.post('/signup',async(req,res)=>{
      const pass = req.body.password;
      const repass= req.body.repassword;
      //const adnew= schema.findOne(res.body.email)
      if(pass===repass)
      {
        const detail ={ user_email:req.body.email,password:pass,user_name:req.body.username,email_status:"notverified"}
       
        try{
          const usr= new schema(detail)
          const adnew = await usr.save();
          const otp=sendmail(req.body.email);
          otpsend=`${otp}`;
          res.render("otpverification",{email:req.body.email})
           }
        catch
        {
          res.status(400).send("email is all ready register"+"<html><br><br><a href='/'>return<a></html>");
        }
      
       
      }
      
      else{
        res.send("entered password is not matching"+"<html><br><br><a href='/'>return<a></html>")
        }
        
         
    })


//otp verification

    app.post("/otpverification",async(req,res)=>{
  
           
          if(otpsend===req.body.otp)
          {
            await schema.updateOne({user_email:req.body.email},{email_status:"verified"});
            res.redirect("/")
          }
          else
          {
            res.send("otp is not matching")

          }

    })

    
    //login post

    app.post("/login", async (req, res) => {
      
      try {
          const lemail = req.body.email
          const lpassword = req.body.password
  
          const semail = await schema.findOne({ user_email: lemail })
          if(semail&& semail.email_status==="verified")
          {
         // res.send(semail)
  
         // const pcheck = await bcrypt.compare(lpassword, semail.password)
  
          if (lpassword!=semail.password) {
  
              res.send( "password not match" );
          }
          else {
                  const token = jwt.sign({email:semail.email,id:semail._id},key)
                   res.cookie("token", token, {
                  expires: new Date(Date.now() + time),
                    httpOnly: true})
                    console.log(token);
                    useremail=lemail;
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

app.get("/forgetpassword",(req,res)=>{

  res.render("forgetpassword");

})


// forget password post

app.post("/forgetpassword",async(req,res)=>{
  const semail = await schema.findOne({ user_email: req.body.email })
  if(!semail)
  {
    res.send("Email is not register"+"<html><br><br><a href='/'>signup<a></html>")
  }
  else
  {
  const otp=sendmail(req.body.email);
  otpsend=`${otp}`;
  res.render("fov",{email:req.body.email})
  }

})


//forget password otp verification

app.post("/fov",async(req,res)=>{
  
           
  if(otpsend===req.body.otp)
  {
    await schema.updateOne({user_email:req.body.email},{password:req.body.password});
    res.redirect("/")
  }
  else
  {
    res.send("otp is not matching"+"<html><br><br><a href='/'>signup<a></html>")

  }

})


//google passport login

  app.get("/googlelogin",isLoggedIn, async (req,res)=>{
    useremail=req.user.email;
    const semail = await schema.findOne({ user_email: req.user.email})
    if(!semail)
    {
    try{
      const detail= {user_name:req.user.displayName,user_email:req.user.email,email_status:"verified",product_id:[],product_price:[], product_quantity:[],} 
      
  const usr = new schema(detail);
   const adnew = await usr.save();
  // res.status(201).send(adnew);
  res.redirect("/user_logged_in");
     }
      catch(error){
        res.status(400).send(error);
      }
  }
  else
  {
    res.redirect("/user_logged_in");
  }
  })

   app.get("/user_logged_in",isLoggedIn,(req,res)=>{

     if(useremail==0)
    {
    
      res.redirect("/");
    }
   else{

        res.render("homepage",{email:useremail});
   }
   })   
    app.get("/scan_product_storing",isLoggedIn,(req,res)=>{
      
      if(useremail==0)
      {
      
        res.redirect("/");
      }
      else
      res.render("storing",{email:useremail});
  
  
  })
  app.post("/product_storing",isLoggedIn, async(req,res)=>{
   
    if(useremail==0)
    {
    
      res.redirect("/");
    }
else{
    let id  = req.body.product_id;
    id = JSON.parse(id);
    let price  = req.body.product_price;
    price = JSON.parse(price);
    let quantity = req.body.product_quantity;
    quantity = JSON.parse(quantity);
    let data = await schema.findOne({user_email:useremail})
    console.log(id[1])
    data.product_id.push(id)
    data.product_price.push(price)
    data.product_quantity.push(quantity)
    
  const data2= await schema.updateOne({user_email:useremail},{ product_id:data.product_id,product_price:data.product_price, product_quantity:data.product_quantity})
      res.send(data);
   console.log(data);// res.redirect("/scan_product_storing")
}
 
})

  



app.get("/scan_product_selling",isLoggedIn, (req,res)=>{

  if(useremail==0)
  {

  res.redirect("/");
}
    res.render("selling",{email:useremail});


})
app.post("/scan_product_selling",isLoggedIn, async(req,res)=>{
  if(useremail==0)
  {
  
    res.redirect("/");
  }
  
  const product_id = req.body.id;
  const product_price = req.body.price;
  var product_quantity = req.body.quantity;
  

  let data =await schema.findOne({user_email:useremail});
  product_quantity=data.product_quantity-req.body.quantity;
  const data2= await schema.updateOne({user_email:useremail},{ product_id:req.product_quantity,product_price :req.body.price, product_quantity : req.body.quantity})

  res.redirect("/store",{onedate:data2});

})
 

app.listen(port,()=>console.log("server is up....."));
