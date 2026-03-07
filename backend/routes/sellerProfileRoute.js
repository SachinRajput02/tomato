import express from "express"
import multer from "multer"
import upload from "../config/multerCloudinary.js";

import { getSellerProfile,updateSellerProfile,updateShopImage,updateShopStatus,getShopStatus,getShopLocation,updateShopLocation } from "../controllers/profileController.js"

import authMiddleware from "../middleware/sellerAuth.js";
import newauthMiddleware from "../middleware/newSellerAuth.js";
import { get } from "mongoose";

const sellerProfileRouter = express.Router();



// const storage = multer.diskStorage({
//     destination:"uploads/shop_folder",
//     filename:(req,file,cb)=>{
//         return cb(null,`${Date.now()}${file.originalname}`)
//     }
// })

// const upload = multer({storage:storage})


// Route to update shop location

sellerProfileRouter.post("/getSellerProfile",authMiddleware,getSellerProfile);
sellerProfileRouter.post("/updateSellerProfile",authMiddleware,updateSellerProfile);
sellerProfileRouter.put("/updateShopImage",newauthMiddleware,upload.single("shopPic"),updateShopImage);
sellerProfileRouter.post("/updateShopStatus",newauthMiddleware,updateShopStatus);
sellerProfileRouter.post("/getShopLocation",getShopLocation);
sellerProfileRouter.get("/getShopStatus",newauthMiddleware,getShopStatus);
sellerProfileRouter.put('/update-location',authMiddleware, updateShopLocation);

export default sellerProfileRouter;



