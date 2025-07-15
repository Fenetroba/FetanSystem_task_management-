import express from 'express'
import { Login, LogOut, Registration } from '../controllers/User.js'

const router=express.Router()


router.post('/register',Registration)
router.post('/login',Login)
router.post('/logout',LogOut)

export default router