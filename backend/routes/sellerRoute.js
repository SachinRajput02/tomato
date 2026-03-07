import express from "express";
import { registerSeller, loginSeller,getSellerShopname } from "../controllers/sellerController.js";
import sellerAuthMiddleware from "../middleware/sellerAuth.js";

const sellerRouter = express.Router();
sellerRouter.post("/register", registerSeller);
sellerRouter.post("/login", loginSeller);
sellerRouter.post("/shopName",sellerAuthMiddleware, getSellerShopname);

export default sellerRouter;
