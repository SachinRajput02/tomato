import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: { type: String, default: "default-name" },
  shopName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    validate: {
      validator: (v) => /^[+\d]?(?:[\d-.\s()]*)$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },default: "1234567890",
  },
  shopStatus: { type: Boolean, default: false },
  shopPic: { type: String, default: "https://res.cloudinary.com/deb13rakg/image/upload/v1754806611/shop_profile_images/xx3tafakavth8sb97gcz.png" },
  photos: { type: [String], default: [] },
  address: {
    type: Object,
    default: {
      firstName: "default-name", lastName: "xyz", addEmail: "23mc3000@rgipt.ac.in",
      street: "rgipt jais", city: "amethi", state: "uttar pradesh", zipcode: "229304",
      country: "india", addPhone: "1234567890",
    },
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [75.8321, 26.9582] },
  },
  timing: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "21:00" },
  },
  rating: { type: Number, default: 0 },
  deliveryCharges: {
    baseDistance: { type: Number, default: 5 }, 
    baseCharge: { type: Number, default: 20 },
    perKmCharge: { type: Number, default: 5 }
  },
  fcmToken: { type: String },
  sellerCartData: { type: Object, default: {} },
}, { timestamps: true });

sellerSchema.index({ location: '2dsphere' });

const sellerModel = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);
export default sellerModel;


