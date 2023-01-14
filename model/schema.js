const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    user_name:{
        type:String,
    },
    user_email:{
        type:String,
       unique:[true,"email already exist"]
    },
    email_status:{
        type:String
    },
    password:{
        type:String,
       
    },

    product_id:{
        type:Array,
        
         },
    product_price:{
        type:Array,
    },
    product_quantity:{
        type:Array,
    }
    
});
const usr= new mongoose.model("Data_base",userschema);
module.exports=usr;