
import express from "express";
import { getDeliveryCharge } from "../controllers/deliveryChargeController.js";

const deliveryCostrouter = express.Router();

deliveryCostrouter.post("/delivery-charge", getDeliveryCharge);

export default deliveryCostrouter;
