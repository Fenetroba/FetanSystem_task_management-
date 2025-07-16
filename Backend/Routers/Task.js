import express from "express";
import { CreateTask, DeleteTask, GetTask, UpdateTask } from "../controllers/Task.js";
import { middleware } from "../Middleware/middleware.js";
const router =express.Router();


router.post('/task',middleware ,CreateTask)
router.get('/task',middleware ,GetTask)
router.patch('/task/:id',middleware ,UpdateTask)
router.delete('/task/:id',middleware ,DeleteTask)


export default router