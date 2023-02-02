const express = require("express");
const router = express.Router();
const schema = require("../model/storing")
const isLoggedIn = require("../middleware/middleware")


router.get("/user_logged_in",isLoggedIn,(req,res)=>{

    

       res.render("homepage",{email:req.email});
  
  })  
  
  
   router.get("/scan_product_storing",isLoggedIn,(req,res)=>{
     
     
     res.render("storing",{email:req.email});
 
 
 })
 router.post("/product_storing",isLoggedIn, async(req,res)=>{
  
 //  try{
      const detail = req.body.detail;
   let data = await schema.findOne({email:req.email})
   
   data = detail.concat(data.product_deatil);
 const data2= await schema.updateOne({email:req.email},{product_deatil:data})
     res.redirect("/scan_product_storing");
  console.log(data);
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
