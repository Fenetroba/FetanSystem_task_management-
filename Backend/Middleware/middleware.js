import jwt from "jsonwebtoken";
import UserSchema from '../models/User.js';
import env from 'dotenv'
env.config()
export const middleware = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;
		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		let decoded;
			decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			const user = await UserSchema.findById(decoded.userId).select("-password");
			
			if (!user) {
				return res.status(401).json({ message: "Unauthorized - User not found" });
			}
			req.user = user;
			next();
		
	} catch (error) {
		console.log("Error in protectRoute middleware:", error.message);
		return res.status(401).json({ message: "Unauthorized - Middleware error" });
	}
};


