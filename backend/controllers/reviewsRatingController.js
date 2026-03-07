import reviewModel from "../models/reviewModel.js";
import foodModel from "../models/foodModel.js";
import sellerModel from "../models/sellerModel.js";


const updateAverageRating = async (targetType, targetId) => {
  const reviews = await reviewModel.find({ targetType, targetId });
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  if (targetType === "Food") {
    await foodModel.findByIdAndUpdate(targetId, { rating: avg });
  } else if (targetType === "Seller") {
    await sellerModel.findByIdAndUpdate(targetId, { rating: avg });
  }
};

const createReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;
    const userId = req.userId;

    if (!["Food", "Seller"].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }

    const existing = await reviewModel.findOne({ targetType, targetId, user: userId });
    if (existing) {
      return res.status(409).json({ message: "You already reviewed this seller/Food" });
    }

    const newReview = await reviewModel.create({
      targetType,
      targetId,
      rating,
      comment,
      user: userId
    });

    await updateAverageRating(targetType, targetId);

    res.status(201).json({ message: "Review submitted", review: newReview });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;

    if (!["Food", "Seller"].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }
    const reviews = await reviewModel.find({ targetType, targetId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getAverageRating = async (req, res) => {
  try {
    const { targetType, targetId } = req.body;

    if (!["Food", "Seller"].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }

    const reviews = await reviewModel.find({ targetType, targetId });

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length ? total / reviews.length : 0;

    res.status(200).json({ averageRating: avgRating.toFixed(2), count: reviews.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export {updateAverageRating,createReview,getReviews,getAverageRating}