import express from "express";
import { CreateTask, DeleteTask, GetTask, UpdateTask } from "../controllers/Task.js";
import { middleware } from "../Middleware/middleware.js";
const router =express.Router();


router.post('/create',middleware ,CreateTask)
router.get('/get-task',middleware ,GetTask)
router.patch('/update-task/:id',middleware ,UpdateTask)
router.delete('/delete-task/:id',middleware ,DeleteTask)


export default router