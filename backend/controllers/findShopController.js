
import sellerModel from "../models/sellerModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";


const findNearByShops = async (req, res) => {
  const {  longitude,latitude,maxDistance } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude required' });
  }

  try {
    const nearbyShops = await sellerModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: maxDistance,
        },
      },
      {
        $project: {
          shopName: 1,
          rating:1,
          shopPic: 1,
          distance: { $divide: ['$distance', 1000] }, // Convert to KM
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.json(nearbyShops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const findNearestXShops = async (req, res) => {
  const { longitude, latitude, limit } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude required' });
  }

  try {
    const nearbyShops = await sellerModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          spherical: true,
        },
      },
      {
        $project: {
          shopName: 1,
          rating: 1,
          shopPic: 1,
          distance: { $divide: ['$distance', 1000] }, // Convert to KM
        },
      },
      {
        $sort: { distance: 1 }, // Closest first
      },
      {
        $limit: parseInt(limit) || 1,
      },
    ]);

    res.json(nearbyShops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



 const addToFavourites = async (req, res) => {
  const { userId, sellerId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user.favouriteShops.includes(sellerId)) {
      user.favouriteShops.push(sellerId);
      await user.save();
      res.status(200).json({ message: "Shop added to favourites" });
    }
    else {
      res.status(400).json({ message: "Shop already in favourites" });
    }
    
  } catch (error) {
    res.status(500).json({ error: "Failed to add shop" });
  }
};

 const removeFromFavourites = async (req, res) => {
  const { userId, sellerId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { favouriteShops: sellerId }
    });
    res.status(200).json({ message: "Shop removed from favourites" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove shop" });
  }
};
const getFavouriteShops = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId).populate({
      path: "favouriteShops",
      select: "shopPic shopName location sellerCartData sellerId"
    });

    res.status(200).json( user.favouriteShops);
  } catch (error) {
    console.error("Error in getFavouriteShops:", error);
    res.status(500).json({ error: "Failed to fetch favourite shops" });
  }
};

const getShopById = async (req, res) => {
  const { sellerId } = req.body;

  try {
    const shop = await sellerModel.findById(sellerId).select(
      " sellerId shopPic shopName location email phone address  sellerDescription sellerRating sellerReviews sellerRatingCount sellerRatingTotal "
    );
    
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json( shop);
  } catch (error) {
    console.error("Error in getShopById:", error);
    res.status(500).json({ error: "Failed to fetch shop" });
  }
};

export {findNearByShops,addToFavourites,removeFromFavourites,getFavouriteShops,getShopById,findNearestXShops}

