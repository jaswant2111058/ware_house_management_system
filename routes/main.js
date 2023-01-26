const express = require("express");
const router = express.Router();
const schema = require("../model/schema")
const isLoggedIn = require("../middleware/middleware")


router.get("/user_logged_in",isLoggedIn,(req,res)=>{

    

       res.render("homepage",{email:useremail});
  
  })  
  
  
   router.get("/scan_product_storing",isLoggedIn,(req,res)=>{
     
     
     res.render("storing",{email:req.email});
 
 
 })
 router.post("/product_storing",isLoggedIn, async(req,res)=>{
  
 //  try{
      const detail = req.body.detail;
   let data = await schema.findOne({user_email:useremail})
   
   data = detail.concat(data.product_deatil);
 const data2= await schema.updateOne({user_email:useremail},{ user_name:"ojassi"})
     res.send(req.email);
  console.log(data);// res.redirect("/scan_product_storing")
    // }
    // catch{
    //  res.status(400).send("error") 
    //   }

})


router.get("/scan_product_selling",isLoggedIn, (req,res)=>{

 

   res.render("selling",{email:req.email});


})
router.post("/scan_product_selling",isLoggedIn, async(req,res)=>{
 
 
 const product_id = req.body.id;
 const product_price = req.body.price;
 var product_quantity = req.body.quantity;
 

 let data =await schema.findOne({user_email:req.email});
 product_quantity=data.product_quantity-req.body.quantity;
 const data2= await schema.updateOne({user_email:req.email},{ product_id:req.product_quantity,product_price :req.body.price, product_quantity : req.body.quantity})

 res.redirect("/store",{onedate:data2});

})


module.exports=router;
