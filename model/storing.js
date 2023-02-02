const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
       unique:[true,"email already exist"]
    },
    email_status:{
        type:Boolean
    },
    password:{
        type:String,
    },
    otp:{
        type:String,
        timestamps:true
    },

    product_detail:{
        type:Array,
         },
    createdAt:{type:Date,default:Date.now,index:{expires:30}}
});
const usr= new mongoose.model("Data_base",userschema);
module.exports=usr;