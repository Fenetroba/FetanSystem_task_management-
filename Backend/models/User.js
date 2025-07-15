import mongoose from 'mongoose';

const User=new mongoose.Schema({
     name:{type:String,required:true},
     email:{type:String,required:true,unique:true},
     password:{type:String,required:true},
},{timestamps:true})

const UserSchema=new mongoose.model("User",User)
export default UserSchema;