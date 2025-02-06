
import mongoose from "mongoose";


export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://srsisodia:Sr321026@cluster1.3pxza.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}









