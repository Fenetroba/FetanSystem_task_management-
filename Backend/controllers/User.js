import UserSchema from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config()
// for generate token
const generateTokens = (userId) => {
     const accessToken = jwt.sign(
       { userId },
       process.env.ACCESS_TOKEN_SECRET,
       { expiresIn: "15m" }
     );
   
     const refreshToken = jwt.sign(
       { userId },
       process.env.REFRESH_TOKEN_SECRET,
       { expiresIn: "7d" }
     );
   
     return { accessToken, refreshToken };
   };
   
//  for set cooke to browser
const setCookies = (res, accessToken, refreshToken) => {
     res.cookie("accessToken", accessToken, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: "strict",
       maxAge: 15 * 60 * 1000, 
     });
     res.cookie("refreshToken", refreshToken, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: "strict",
       maxAge: 7 * 24 * 60 * 60 * 1000, 
     });
   };

export const  Registration= async (req, res) => {
     const { name, email, password } = req.body;
     try {
       const UserExist = await UserSchema.findOne({ email });
       if (UserExist) {
         return res.status(400).json({ success: false, message: "the Email is alrady exist" });
       }
       if (!name || !email || !password) {
         return res.status(400).json({ success: false, message: "the all are required" });
       }
       if (password.length < 6) {
         return res.status(400).json({ success: false, message: "the password length have be greter than 6" });
       }
       const HashPassword = await bcrypt.hash(password, 10);
       const user = await UserSchema.create({ name, email, password: HashPassword });
       return res.status(201).json({
         _id: user._id,
         name: user.name,
         email: user.email,
         message: "Registration SuccessFull",
         success:true,
       });
     } catch (error) {
       res.status(500).json({ error, message: "the error create on registration" });
       console.log(error);
     }
   };
export const Login = async (req, res) => {
     const { email, password } = req.body;
     try {
       const user = await UserSchema.findOne({ email });
      if(email && password){
          if (!user) {
               return res.status(400).json({ success: false, message: "Incorrect Password or Email" });
             }
             const isMatch = await bcrypt.compare(password, user.password);
             if (user && isMatch) {
               //for  Generate tokens with the correct userId
               const { accessToken, refreshToken } = generateTokens(user._id);
               // Set cookies in the correct order
               setCookies(res, accessToken, refreshToken);
               return res.status(200).json({ success: true, message: "Login Successful" });
             } else {
               return res.status(400).json({ success: false, message: "Incorrect Password or Email" });
             }
      }
      else{
          return res.status(400).json({success:false,message:"you should fill the email and password"})
      }
     } catch (error) {
       console.log(error);
       return res.status(500).json({ success: false, message: "Error occurred on Login controller" });
     }
   };
   
export const LogOut = async (req, res) => {
     try {
       res.clearCookie("accessToken");
       res.clearCookie("refreshToken");
       res.json({ message: "Logged out successfully" });
     } catch (error) {
       console.log("Error in logout controller", error.message);
       res.status(500).json({ message: "Server error", error: error.message });
     }
   };
export const UserProfile = async (req, res) => {
     try {
       return res.status(200).json({
         name: req.user.name,
         email:req.user.email
       });
     } catch (error) {
       return res.status(401).json({ success: false, message: "Invalid or expired token" });
     }
   };

export const refreshToken = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
      }
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
 
      const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      res.json({ message: "Token refreshed successfully" });
    } catch (error) {
      console.log("Error in refreshToken controller", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };