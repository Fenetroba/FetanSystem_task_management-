import mongoose from 'mongoose'


const tasks = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: "pending" ,enum:["complited","pending"]},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const taskschema=new mongoose.model("Task",tasks)
export default taskschema