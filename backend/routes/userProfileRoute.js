import express from "express"
import { getUserProfile,getUserProfilePicAndName,updateUserProfile } from "../controllers/profileController.js"
import authMiddleware from "../middleware/auth.js";
import newauthMiddleware from "../middleware/UserAuth.js";
import upload from "../config/multerCloudinary.js";

import { updateUserImage } from "../controllers/profileController.js";

const userProfileRouter = express.Router();



userProfileRouter.post("/getUserprofile",authMiddleware,getUserProfile);
userProfileRouter.get("/getUserProfilePicAndName/:userId",getUserProfilePicAndName);
userProfileRouter.post("/updateUserprofile",authMiddleware,updateUserProfile);
userProfileRouter.put("/updateUserImage",newauthMiddleware,upload.single("profilePic"),updateUserImage);

export default userProfileRouter;
