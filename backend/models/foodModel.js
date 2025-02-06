import mongoose from "mongoose";

const foodSchema =new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
    category:{type:String,required:true},
    shopname:{type:String,required:true},
    shopStatus:{type:Boolean,required:true,default:true}

    // seller: { type: mongoose.Schema.Types.ObjectId, ref: 'seller' }
})  

const foodModel = mongoose.models.food || mongoose.model("food",foodSchema)


export default foodModel;   