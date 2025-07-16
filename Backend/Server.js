import express from 'express'
import env from 'dotenv'
const PORT=process.env.PORT || 5000
env.config()
import {DBconnect} from './lib/DataBase.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import UserRouter from './Routers/User.js'
import TaskRouter from './Routers/Task.js'
const app=express()
app.use(express.json());
app.use(cookieParser());
app.use(cors({
     origin: true,
     credentials: true,
}))
app.use('/',UserRouter)
app.use('/',TaskRouter)
app.listen(PORT,()=>{
     console.log("the server connect with port ",PORT)
     DBconnect();

})