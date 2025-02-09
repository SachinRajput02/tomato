import sellerModel from "../models/sellerModel.js";
import jwt from "jsonwebtoken";
const bcryptjs = require('bcryptjs');

// import bcrypt from "bcrypt";


import validator from "validator";

// Register Seller
const registerSeller = async (req, res) => {
  const { name, email, password, shopName,fcmToken } = req.body;

  try {
    const exists = await sellerModel.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "Seller already exists" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newseller = new sellerModel({
      name,
      email,
      password: hashedPassword,
      fcmToken,
      shopName,
      sellerCartData: {},
      
    });
    const seller = await newseller.save();

    const sellerToken = jwt.sign({ id: seller._id }, process.env.JWT_SECRET);
    res.json({ success: true, sellerToken });
   
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error registering seller" });
  }
};

// Seller Login
const loginSeller = async (req, res) => {
  const { email, password,fcmToken } = req.body;
  const seller = await sellerModel.findOne({ email });

  if (!seller || !(await bcryptjs.compare(password, seller.password))) {
    return res.json({ success: false, message: "Invalid credentials or seller not exits" });
  }

  const sellerToken = jwt.sign({ id: seller._id }, process.env.JWT_SECRET);

  seller.fcmToken = fcmToken;
  await seller.save();
  
  res.json({ success: true, sellerToken });
};


const getSellerShopname = async(req,res)=>{
  try {
    const seller = await sellerModel.findOne({ _id: req.body.sellerId });
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    return res.json({ success: true, shopName: seller.shopName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}





export { loginSeller,registerSeller,getSellerShopname};

