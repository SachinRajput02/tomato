import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  photos: { type: [String], default: [] },
  category: { type: String, required: true },
  shopname: { type: String, required: true },
  shopStatus: { type: Boolean, default: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  rating: { type: Number, default: 0 },
});

const foodModel = mongoose.models.Food || mongoose.model("Food", foodSchema);
export default foodModel;

