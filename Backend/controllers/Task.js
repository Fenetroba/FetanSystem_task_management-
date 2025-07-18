import taskschema from "../models/Task.js";

export const CreateTask = async (req, res) => {
    const { name, status } = req.body;
    const userId = req.user.id;
    console.log(userId)

    try {
        if (!name) {
            return res.status(400).json({ success: false, message: "you should add the task name" });
        } else {
            const Newtask = await taskschema.create({ name, status, user: userId });
            return res.status(201).json({ success: true, message: "the task is created" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "the error is created on create task controller" });
    }
}
export const GetTask = async (req, res) => {
    try {
        const userId = req.user.id; 

        // ----------------Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        //--------------------- Search parameter
        const search = req.query.search || "";

        //--------------------- Build query
        const query = {
            user: userId,
            ...(search && { name: { $regex: search, $options: "i" } })
        };

        // Get total count for pagination
        const total = await taskschema.countDocuments(query);

      
        const tasks = await taskschema
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            tasks,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching tasks" });
    }
};
export const UpdateTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id; 
        const {status } = req.body;
        const task = await taskschema.findOneAndUpdate(
            { _id: taskId, user: userId },
            {status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found or not authorized" });
        }

        return res.status(200).json({ success: true, message: "Task updated", task });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error updating task" });
    }
}
export const DeleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const task = await taskschema.findOneAndDelete({ _id: taskId, user: userId });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found or not authorized" });
        }

        return res.status(200).json({ success: true, message: "Task deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting task" });
    }
}