import express from 'express'
import { Login, LogOut, Registration, UserProfile } from '../controllers/User.js'
import { middleware } from '../Middleware/middleware.js'

const router=express.Router()


router.post('/register',Registration)
router.post('/login',Login)
router.post('/logout',LogOut)
router.get('/profile',middleware ,UserProfile)

export default router