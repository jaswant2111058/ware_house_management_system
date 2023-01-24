const express = require("express");
const router = express.Router();
const schema = require("../model/schema")
const isLoggedIn = require("../middleware/middleware")


router.get("/user_logged_in",isLoggedIn,(req,res)=>{

    if(useremail==0)
   {
     res.redirect("/");
   }
  else{

       res.render("homepage",{email:useremail});
  }
  })   
   router.get("/scan_product_storing",isLoggedIn,(req,res)=>{
     
     if(useremail==0)
     {
     
       res.redirect("/");
     }
     else
     res.render("storing",{email:useremail});
 
 
 })
 router.post("/product_storing",isLoggedIn, async(req,res)=>{
  
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


router.get("/scan_product_selling",isLoggedIn, (req,res)=>{

 if(useremail==0)
 {

 res.redirect("/");
}
   res.render("selling",{email:useremail});


})
router.post("/scan_product_selling",isLoggedIn, async(req,res)=>{
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


module.exports=router;
