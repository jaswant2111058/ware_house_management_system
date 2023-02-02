const express =  require("express");
const router = express.Router();
const passport = require('passport');
const schema = require("../model/storing")
const session = require('express-session');
const isLoggedIn = require("../middleware/middleware")
require("../auth")

router.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));
router.use(session({ secret: "jassi", resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());


router.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/googlelogin',
    failureRedirect: '/auth/google/failure'
  })
);

router.get("/googlelogin",isLoggedIn, async (req,res)=>{
    useremail=req.user.email;
    const semail = await schema.findOne({ user_email: req.user.email})
    if(!semail)
    {
    try{
      const detail= {user_name:req.user.displayName,user_email:req.user.email,email_status:true,product_detail:[]} 
      
  const usr = new schema(detail);
   const adnew = await usr.save();



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



module.exports = router;
