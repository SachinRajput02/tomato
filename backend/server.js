import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import dotenv from "dotenv";
import sellerRouter from "./routes/sellerRoute.js";
import sellerCartRouter from "./routes/sellerCartRoute.js";



dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// db conection
connectDB();

//api endpoints
app.use("/api/food", foodRouter);
// app.use("/api/sellerFood",foodRouter)
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);

app.use("/api/cart", cartRouter);
app.use("/api/sellerCart", sellerCartRouter);
app.use("/api/order", orderRouter);

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

//// chatgpt code end here

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
