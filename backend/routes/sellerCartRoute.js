import express from "express"

import {addToSellerCart,removeFromSellerCart, getsellerCart ,getSellerProfile} from "../controllers/sellerCartController.js"
import sellerAuthMiddleware from "../middleware/sellerAuth.js"

const sellerCartRouter = express.Router();
sellerCartRouter.post("/selleradd",sellerAuthMiddleware, addToSellerCart)
sellerCartRouter.post("/sellerremove",sellerAuthMiddleware,removeFromSellerCart)
sellerCartRouter.post("/sellerget",sellerAuthMiddleware,getsellerCart)
sellerCartRouter.post("/sellerProfile",sellerAuthMiddleware,getSellerProfile)



export default sellerCartRouter;

