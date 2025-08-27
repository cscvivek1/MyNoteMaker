import mongoose from "mongoose";
const bookSchema= new mongoose.Schema({
    name:String,
    author:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    }
},{timestamps:true})
export default mongoose.model('book',bookSchema);