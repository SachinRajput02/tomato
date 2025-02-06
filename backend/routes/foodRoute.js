
import express from "express"

import { addFood ,listFood ,listsellerFood,removeFood,changeShopFoodStatus} from "../controllers/foodController.js";

import multer from "multer"
import sellerAuthMiddleware from "../middleware/sellerAuth.js";
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",sellerAuthMiddleware,upload.single("image"),addFood)


foodRouter.get("/list",listFood)
foodRouter.get("/sellerfoodlist",listsellerFood)

foodRouter.post("/remove",removeFood);
foodRouter.post("/changeshopStatus",changeShopFoodStatus);


export default foodRouter;





















// import express from "express";
// import multer from "multer";
// import { addFood, listFood, removeFood } from "../controllers/foodController.js";

// const foodRouter = express.Router();

// // Image Storage Engine
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads"); // Ensure "uploads" folder exists or handle error
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueSuffix);
//     }
// });

// // Configure Multer
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000 * 1024 * 1024 }, // Limit file size to 5MB
//     fileFilter: (req, file, cb) => {
//         // Optional: Validate file types (e.g., only images allowed)
//         const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
//         if (!allowedMimeTypes.includes(file.mimetype)) {
//             return cb(new Error("Invalid file type. Only images are allowed."));
//         }
//         cb(null, true);
//     }
// });

// // Routes
// foodRouter.post("/add", upload.single("image"), (req, res, next) => {
//     try {
//         addFood(req, res);
//     } catch (error) {
//         next(error); // Forward error to default error handler
//     }
// });

// foodRouter.get("/list", (req, res, next) => {
//     try {
//         listFood(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

// foodRouter.post("/remove", (req, res, next) => {
//     try {
//         removeFood(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

// export default foodRouter;



