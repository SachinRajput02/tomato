import foodModel from "../models/foodModel.js";
import sellerModel from "../models/sellerModel.js";
import fs from "fs";


const addFood = async (req, res) => {
  if (!req.sellerId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No sellerId provided" });
  }

  //  Use Cloudinary URL directly:
  const imageUrl = req.file.path;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: imageUrl,
    shopname: req.body.shopname,
    sellerId: req.sellerId,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added", itemId: food._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error from backend" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food) {
      // Corrected fs.unlink to use template literals correctly
      fs.unlink(`uploads/${food.image}`, () => {});

      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "Food not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//find sellers food
const listsellerFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    let foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const listFoodByShopNames = async (req, res) => {
  try {
    const shopNames = req.body.shopNames; // Expecting: ["Shop A", "Shop B", "Shop C"]

    // Find sellers matching any of the shop names
    const sellers = await sellerModel.find({ shopName: { $in: shopNames } });
    const sellerIds = sellers.map((seller) => seller._id);

    let foods = await foodModel.find({ sellerId: { $in: sellerIds } });

    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// const listFoodBySellerId = async (req, res) => {
//     try {
//         const sellerId = await sellerModel.findOne( req.body.shopName );
//         const foods = await foodModel.find({ sellerId:sellerId._id});
//         res.json({ success: true, data: foods });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" });
//     }
// };

// remove food item
const changeShopFoodStatus = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food) {
      const updatedStatus = !food.shopStatus;

      await foodModel.findByIdAndUpdate(req.body.id, {
        shopStatus: updatedStatus,
      });
      res.json({ success: true, message: "Food Removed From Live Foods" });
    } else {
      res.json({ success: false, message: "Food not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating shopStatus" });
  }
};

export {
  addFood,
  listFood,
  listsellerFood,
  removeFood,
  changeShopFoodStatus,
  listFoodByShopNames,
};
