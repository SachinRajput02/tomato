import express from "express";

import {
  addFood,
  listFood,
  listsellerFood,
  listFoodByShopNames,
  removeFood,
  changeShopFoodStatus,
} from "../controllers/foodController.js";
import upload from "../config/multerCloudinary.js";

import multer from "multer";
import sellerAuthMiddleware from "../middleware/sellerAuth.js";
import newSellerAuthuthMiddleware from "../middleware/newSellerAuth.js";


const foodRouter = express.Router();

// Image Storage Engine

// const storage = multer.diskStorage({
//   destination: "uploads/food_folder",
//   filename: (req, file, cb) => {
//     return cb(null, `${Date.now()}${file.originalname}`);
//   },
// });
// const upload = multer({ storage: storage });

foodRouter.post("/add", newSellerAuthuthMiddleware, upload.single("image"), addFood);

foodRouter.get("/list", listFood);
foodRouter.get("/sellerfoodlist", listsellerFood);
foodRouter.post("/listFoodByShopNames",listFoodByShopNames);
foodRouter.post("/remove", removeFood);
foodRouter.post("/changeshopStatus", changeShopFoodStatus);

export default foodRouter;