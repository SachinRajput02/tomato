import userModel from "../models/userModel.js";
import sellerModel from "../models/sellerModel.js";

//user Controller
const getUserProfile = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let name = await userData.name;
    let email = await userData.email;
    let phone = await userData.phone;
    let address = await userData.address;
    let profilePic = await userData.profilePic;

    res.json({ success: true, name, email, phone, address, profilePic });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error to getting user profile details",
    });
  }
};


const getUserProfilePicAndName = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const { name, profilePic } = userData;
    res.json({ success: true, name, profilePic });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error fetching user profilePic and Name",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.body.userId, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        addEmail: req.body.addEmail,
        addPhone: req.body.addPhone,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        country: req.body.country,
      },
    });
    res.json({ success: true, message: "User profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error to update user profile details",
    });
  }
};

 const updateUserImage = async (req, res) => {
  try {
    const imageUrl = req.file.path; // This is full Cloudinary Url

    await userModel.findByIdAndUpdate(req.userId, {
      profilePic: imageUrl,
    });

    res.json({
      success: true,
      message: "Profile pic updated",
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Failed to update profile pic",
    });
  }
};

//seller Controller
const getSellerProfile = async (req, res) => {
  try {
    let userData = await sellerModel.findById(req.body.sellerId);
    let name = await userData.name;
    let email = await userData.email;
    let phone = await userData.phone;
    let deliveryCharges = await userData.deliveryCharges;
    let address = await userData.address;
    let shopPic = await userData.shopPic;
    let shopName = await userData.shopName;
    // let location

    res.json({
      success: true,
      name,
      email,
      phone,
      deliveryCharges,
      address,
      shopPic,
      shopName,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error to getting user profile details",
    });
  }
};
const updateSellerProfile = async (req, res) => {
  try {
    await sellerModel.findByIdAndUpdate(req.body.sellerId, {
      name: req.body.name,
      email: req.body.email,
      shopName: req.body.shopname,
      phone: req.body.phone,
      deliveryCharges: {
        baseDistance: req.body.baseDistance,
        baseCharge: req.body.baseCharge,
        perKmCharge: req.body.perKmCharge,
      },
      address: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        addEmail: req.body.addEmail,
        addPhone: req.body.addPhone,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        country: req.body.country,
      },
    });
    res.json({ success: true, message: "Seller profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error to update seller profile details",
    });
  }
};

const updateShopImage = async (req, res) => {
  try {
    const seller = await sellerModel.findById(req.sellerId);
    if (!seller)
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    seller.shopPic = req.file.path;
    await seller.save();

    res.json({ success: true, message: "Image updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateShopStatus = async (req, res) => {
  try {
    if(!req.sellerId) {
      return res.status(400).json({ success: false, message: "Seller ID is required" });
    }
    const seller = await sellerModel.findById(req.sellerId);
    
    if (!seller)
      return res
        .status(404)
        .json({ success: false, message: `Seller not found` });

    seller.shopStatus = req.body.shopStatus;
    await seller.save();
    res.json({ success: true, message: `Shop status updated ${req.body.shopStatus} successfully` });
  } catch (error) {
    console.error(`Error updating shop status ${req.sellerId} :`, error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getShopStatus = async (req, res) => {
  try {
    const seller = await sellerModel.findById(req.sellerId);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }
    res.json({ success: true, shopStatus: seller.shopStatus });
  } catch (error) {
    console.error("Error fetching shop status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getShopLocation = async (req, res) => {
  const { longitude, latitude, shopId } = req.body;
  if (!longitude || !latitude || !shopId) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  try {
    const seller = await sellerModel.findById(shopId);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    // Haversine formula
    function toRad(value) {
      return (value * Math.PI) / 180;
    }

    let shopLoc = seller.location;
    if (!shopLoc || !shopLoc.coordinates || shopLoc.coordinates.length < 2) {
      return res.status(400).json({ success: false, message: "Shop location not set" });
    }

    const [shopLng, shopLat] = shopLoc.coordinates;
    const R = 6371; 

    const dLat = toRad(latitude - shopLat);
    const dLon = toRad(longitude - shopLng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(shopLat)) *
        Math.cos(toRad(latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    res.json({ success: true, location: seller.location, distance: distance.toFixed(2) });
  } catch (error) {
    console.error("Error fetching shop location:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




const updateShopLocation = async (req, res) => {
  const { sellerId, latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing latitude/longitude" });
  }

  try {
    const shop = await sellerModel.findById(sellerId);

    if (!shop) return res.status(404).json({ error: "Shop not found" });

    shop.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    await shop.save();
    res.json({ message: "Location updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error from backend" });
  }
};

export {
  getUserProfile,
  getUserProfilePicAndName,
  updateUserProfile,
  updateUserImage,
  getSellerProfile,
  updateSellerProfile,
  updateShopImage,
  updateShopStatus,
  getShopStatus,
  getShopLocation,
  updateShopLocation,
};
