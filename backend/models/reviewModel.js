import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["Food", "Seller"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const reviewModel = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default reviewModel;

