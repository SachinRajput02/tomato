import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Routes
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import userProfileRouter from "./routes/userProfileRoute.js";
import sellerProfileRouter from "./routes/sellerProfileRoute.js";
import orderRouter from "./routes/orderRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import sellerCartRouter from "./routes/sellerCartRoute.js";
import nearByShopRouter from "./routes/findShopRoute.js";
import deliveryCostrouter from "./routes/deliveryRoute.js";
import reviewsRatingRouter from "./routes/reviewsRatingRoute.js";

// Models
import Order from "./models/orderModel.js";

dotenv.config();

// Express app setup
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});


// Allow frontend domain only
app.use(cors());

app.use(express.json());

// DB connection
connectDB();




// Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/userProfile", userProfileRouter);
app.use("/api/sellerProfile", sellerProfileRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/cart", cartRouter);
app.use("/api/sellerCart", sellerCartRouter);
app.use("/api/order", orderRouter);
app.use("/api/findShop",nearByShopRouter)
app.use("/api/delivery", deliveryCostrouter);
app.use("/api/review", reviewsRatingRouter);

// Root route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// SOCKET.IO EVENTS (without Redis)
io.on("connection", (socket) => {
  console.log("🔌 A user connected");

  socket.on("join-room", async (orderId) => {
    socket.join(orderId);
    console.log(`🟢 Joined room: ${orderId}`);

    const order = await Order.findById(orderId);
    if (order && order.chat) {
      socket.emit("chat-history", order.chat);
    }
  });

  socket.on("send-message", async ({ orderId, sender, text }) => {
    const message = { sender, text, timestamp: new Date() };

    await Order.findByIdAndUpdate(orderId, {
      $push: { chat: message }
    });

    io.to(orderId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔌 A user disconnected");
  });
});










// Additional routes for AuraCast features
// Import weather routes
import weatherRouter from "./routes/AuraCastRoutes/weatherRoutes.js";
import locationRouter from "./routes/AuraCastRoutes/autocompleteRoutes.js";

// Use weather routes
app.use('/api/auracast/weather', weatherRouter);
app.use('/api/auracast/locations', locationRouter);



//Routes for news Darshan
import newsApiRouter from "./routes/NewsApiRoutes/newsApiRoute.js";

// Use news API routes
app.use("/api/news", newsApiRouter);















// Start server
server.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});