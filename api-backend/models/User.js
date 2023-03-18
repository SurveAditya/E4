const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    password:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobilenum:{
        type:String,
        required:true,
    },
    address:{
        type:String,
    },
    lat:{
        type:Number,
    },
    long:{
        type:Number,
    },
    category:{
        type:String,
    },
    fee:{
        type:Number,
    },
    experience:{
        type:String,

    },
    timings:{
        type:Array,
    },
    admin:{
        type:Boolean,
        default:false,
    }

});


module.exports=mongoose.model("User",userSchema);