import mongoose from 'mongoose'


const tasks =new mongoose.schema({
     name:{type:String, required:[true,"the task name is required"]},
    status:{enum:['complited','pending'],default:"pending", required:true}

})    