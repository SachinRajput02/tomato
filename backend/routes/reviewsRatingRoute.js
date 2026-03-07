import express from "express";
import { createReview, getReviews, getAverageRating } from "../controllers/reviewsRatingController.js";

import userAuthMiddleware from "../middleware/UserAuth.js";

const  reviewsRatingRouter= express.Router();

reviewsRatingRouter.post("/createReview", userAuthMiddleware, createReview); 
reviewsRatingRouter.get("/:targetType/:targetId", getReviews); 

reviewsRatingRouter.get("/getAverageRating", getAverageRating);

export default reviewsRatingRouter;
