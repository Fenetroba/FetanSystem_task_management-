import express from 'express'
import { Login, LogOut, refreshToken, Registration, UserProfile } from '../controllers/User.js'
import { middleware } from '../Middleware/middleware.js'
const router=express.Router()
router.post('/register',Registration)
router.post('/login',Login)
router.post('/logout',LogOut)
router.get('/profile',middleware ,UserProfile)
router.post("/refresh-token", refreshToken); 
export default router