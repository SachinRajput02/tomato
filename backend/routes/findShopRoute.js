import express from "express"
// import findNearByShops from "../controllers/findShopController";
import {findNearByShops,findNearestXShops,addToFavourites,removeFromFavourites,getFavouriteShops,getShopById} from '../controllers/findShopController.js';
import authMiddleware from "../middleware/auth.js";


const nearByShopRouter = express.Router();

nearByShopRouter.post("/getNearByShop",findNearByShops);
nearByShopRouter.post("/findNearestXShops",findNearestXShops);


nearByShopRouter.post("/addToFavourites",authMiddleware,addToFavourites);
nearByShopRouter.post("/removeFromFavourites",authMiddleware,removeFromFavourites);
nearByShopRouter.post("/getFavouriteShops",authMiddleware,getFavouriteShops);
nearByShopRouter.post("/getShopById",getShopById);


export default nearByShopRouter;
