import express from "express"
import { getUserProfile } from "../controllers/profileController.js"
import authMiddleware from "../middleware/auth.js";

const userProfileRouter = express.Router();

userProfileRouter.post("/getUserprofile",authMiddleware,getUserProfile);

export default userProfileRouter;
