import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:{
            values:['admin','user','guest'],
            message: '{admin,user,guest} are only allowed'
        },
        required:true
    },
    phone:{
        type:String,
        required:true
    }
},{timestamps:true})

export default mongoose.model('user',userSchema);