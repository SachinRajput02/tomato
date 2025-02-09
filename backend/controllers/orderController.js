import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

import Razorpay from "razorpay";
import crypto from "crypto";
import admin from "../config/firebase.js";
import jwt from "jsonwebtoken";
import sellerModel from "../models/sellerModel.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// chat written correct  code start here

// // Place Order

const placeOrder = async (req, res) => {
  const frontendUrl ="https://tomato-frontend-zaz5.onrender.com/";

  try {
    const { items, amount, shopname, address, userId } = req.body;

    // Create a new order with "pending" status
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      shopname,
      payment: false, // Default to false until payment verification
    });

    await newOrder.save();

    // Razorpay payment order creation
    const paymentOrder = await razorpayInstance.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `${newOrder._id}`,
    });

    // Return payment initiation details
    res.json({
      success: false,
      userId:userId,
      // address:address,
      // paymentStatus:false,
      shopname:shopname,
      orderId: newOrder._id,
      paymentOrderId: paymentOrder.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId,shopname,userId ,address} = req.body;

    // Verify Razorpay signature
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update order payment status
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({
        success: true,
        // paymentStatus: true,
        message: "Payment verified successfully",
      });

      //notification to seller
      const seller = await sellerModel.findOne({ shopName: shopname }); // Find seller by shopName
      if (seller && seller.fcmToken) { // Check if seller exists and has an fcmToken
        const message = {
          notification: {
            title: "New Order Received",
            body: `You have a new order from ${address.firstName} ${address.lastName} to deliver at ${address.street} , ${address.city} ,${address.state}, contact at :${address.phone} and ${address.email}`,
          },
          token: seller.fcmToken,
        };
        await admin.messaging().send(message); // Send the notification
      } else {
        console.log("Seller not found or FCM token is missing.");
      }



    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(400).json({
        success: false,
        // paymentStatus: false,
        message: "Payment verification failed order deleted",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      // paymentStatus: false,
      message: "Failed to verify payment",
    });
  }
};





// const placeOrder = async (req, res) => {
//   const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"||"http://localhost:5174";

//   try {
//     const {  items, amount,shopname, address,sellerId } = req.body;

// const newOrder = new orderModel({
//   userId:req.body.userId,
//   items,
//   amount,
//   address,
//   shopname,

// });
// await newOrder.save();

// // Clear user cart
// await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//// Razorpay payment order
// const paymentOrder = await razorpayInstance.orders.create({
//   amount: amount * 100, // Convert to paise
//   currency: "INR",
//   receipt: `${newOrder._id}`,
// });
// res.json({
//   success: true,
//   orderId: newOrder._id,
//   paymentOrderId: paymentOrder.id,
// });

//     const seller = await sellerModel.findOne({ shopName: shopname }); // Find seller by shopName
// if (seller && seller.fcmToken) { // Check if seller exists and has an fcmToken
//   const message = {
//     notification: {
//       title: "New Order Received",
//       body: `You have a new order from ${address.firstName} ${address.lastName} of `,
//     },
//     token: seller.fcmToken,
//   };
//   await admin.messaging().send(message); // Send the notification
// } else {
//   console.log("Seller not found or FCM token is missing.");
// }

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to place order" });
//   }
// };

// cancel order

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);
    await orderModel.findByIdAndDelete(orderId);

    const seller = await userModel.findById(order.sellerId);
    if (seller.fcmToken) {
      const message = {
        notification: {
          title: "Order Cancelled",
          body: `Order #${orderId} has been cancelled.`,
        },
        token: seller.fcmToken,
      };
      await admin.messaging().send(message);
    }

    res.json({
      success: true,
      message: "Order cancelled and seller notified.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error cancelling order" });
  }
};

// Verify Payment
const verifyOrder = async (req, res) => {
  const {  success,orderId, shopname, address  } = req.body;


  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({
        success: true,
        message: "Payment verified and order updated",
      });

      const seller = await sellerModel.findOne({ shopname: shopname }); 
      if (seller && seller.fcmToken) { 
        const message = {
          notification: {
            title: "New Order Received",
            body: `You have a new order from ${address.firstName} ${address.lastName} to deliver at ${address.street} , ${address.city} ,${address.state}, contact at :${address.phone} and ${address.email} `,
          },
          token: seller.fcmToken,
        };
        await admin.messaging().send(message); // Send the notification
      } else {
        console.log("Seller not found or FCM token is missing.");
      }
    }else {
        await orderModel.findByIdAndDelete(orderId);
        res.json({ success: false, message: "Payment failed, order deleted" });
      }
      
        

     
  } catch (error) {
    console.log('verify');
    
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
  }
};

// user orders for frontend

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in fetching userOrder" });
  }
};

// listing order for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in listing orders" });
  }
};

// my and correct api for updating order status

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    req.json({ success: false, message: "Error in updating status" });
  }
};

export {
  placeOrder,
  verifyPayment,
  cancelOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};

//// chat writen code end here

// my written code start here

// placing user order from frontend

// const placeOrder = async (req, res) => {
//   const frontend_url = "http://localhost:5173";

//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     const line_items = req.body.items.map((item) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100 * 80,
//       },
//       quantity: item.quantity,
//     }));

//     line_items.push({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: "Delivery Charges",
//         },
//         unit_amount: 2 * 100 * 80,
//       },
//       quantity: 1,
//     });
//     const session = await razorpay.checkout.sessions.create({
//       line_items: line_items,
//       mode: "payment",
//       success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//     });

//     res.json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// const verifyOrder = async(req,res)=>{
//     const {orderId,success}=req.body;
//     try {
//         if(success=="true"){
//             await orderModel.findByIdAndUpdate(orderId,{payment:true});
//             res.json({success:true,message:"Paid"})
//         }
//         else{
//             await orderModel.findByIdAndDelete(orderId);
//             res.json({success:false,message:"Not Paid"})
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})

//     }
// }

// export { placeOrder,verifyOrder };

// // my written code end here
