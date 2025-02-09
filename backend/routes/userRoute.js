import express from "express"
import pkg from '../controllers/userController.cjs';
const { loginUser,registerUser } = pkg;

const userRouter = express.Router()
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)

export default userRouter ;