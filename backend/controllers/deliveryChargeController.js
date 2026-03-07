
import sellerModel from "../models/sellerModel.js";
import { calculateDeliveryCost } from "./deliveryCostController.js";


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1)); // Round to 1 decimal
}

export const getDeliveryCharge = async (req, res) => {
  try {
    const { sellerId, latitude, longitude } = req.body;

    if (!sellerId || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing sellerId or location" });
    }

    const seller = await sellerModel.findById(sellerId);
    if (!seller || !seller.location?.coordinates) {
      return res.status(404).json({ error: "Seller not found or missing location" });
    }

    const [sellerLon, sellerLat] = seller.location.coordinates;
    const distance = getDistanceFromLatLonInKm(latitude, longitude, sellerLat, sellerLon);

    const cost = calculateDeliveryCost(seller, distance);
    res.json({ cost });
  } catch (err) {
    console.error("Error in getDeliveryCharge:", err);
    res.status(500).json({ error: "Server error" });
  }
};


