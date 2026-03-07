import sellerModel from "../models/sellerModel.js";


const addToSellerCart = async (req, res) => {
    try {
      const sellerData = await sellerModel.findOne({ _id: req.body.sellerId });
  
      if (!sellerData) {
        return res.json({ success: false, message: "Seller not found" });
      }
  
      const sellerCartData = { ...sellerData.sellerCartData }; // Create a copy
      if (!sellerCartData[req.body.itemId]) {
        sellerCartData[req.body.itemId] = 1;
      } else {
        sellerCartData[req.body.itemId] += 1;
      }
  
      await sellerModel.findByIdAndUpdate(req.body.sellerId, { sellerCartData });
      res.json({ success: true, message: "Added to seller cart" });
    } catch (error) {
      console.error("Error in addToSellerCart:", error.message);
      res.json({ success: false, message: "Error in adding to seller cart" });
    }
  };
  

//remove item from user cart
const removeFromSellerCart = async (req,res)=>{
    try {
        let sellerData = await sellerModel.findById(req.body.sellerId);
        let sellerCartData = await sellerData.sellerCartData;
        if(sellerCartData[req.body.itemId]>0){
            sellerCartData[req.body.itemId] -= 1;

        }
        await sellerModel.findByIdAndUpdate(req.body.sellerId,{sellerCartData});
        res.json({success:true,message:"Removed From Cart "})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}




//fetch seller Cart Data
const getsellerCart = async (req,res)=>{
    try {
      const sellerData = await sellerModel.findOne({ _id: req.body.sellerId });
        let sellerCartData = await sellerData.sellerCartData;
        res.json({success:true,sellerCartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error in seller cart data fetching"})
    }
}


const changeShopStatusByShopName = async (req, res) => {
    try {
        const { shopName } = req.body; // Extract shopName from req.body
        
        if (!shopName) {
            return res.json({ success: false, message: "shopName is required" });
        }
        
        // Find all foods with the specified shopName
        const foods = await foodModel.find({ shopName });
        
        if (foods.length === 0) {
            return res.json({ success: false, message: "No foods found for the given shopName" });
        }
        
        // Toggle the shopStatus for all found foods
        const updatedFoods = await Promise.all(
            foods.map(async (food) => {
                const updatedStatus = !food.shopStatus; // Toggle status
                return foodModel.findByIdAndUpdate(food._id, { shopStatus: updatedStatus }, { new: true });
            })
        );

        res.json({ 
            success: true, 
            message: "Shop status updated for all foods", 
            updatedFoods 
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating shopStatus" });
    }
};


export  {addToSellerCart,removeFromSellerCart,getsellerCart};