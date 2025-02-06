import userModel from "../models/userModel.js"



//add item to user cart
const addToCart = async (req,res)=>{
    try {
        let userData = await userModel.findOne({_id:req.body.userId});
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId]= 1 ;
        }
        else{
            cartData[req.body.itemId] += 1;

        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Added To Cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error in cart"});
        
    }
}

//remove item from user cart
const removeFromCart = async (req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 1;

        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Removed From Cart "})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

//fetchUser Cart Data
const getCart = async (req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const getUserProfile = async (req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let name = await userData.name;
        let email = await userData.email;
        let phone = await userData.phone;
        
        res.json({success:true,name,email,phone})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error to getting user profile details"})
    }
}


export  {addToCart,removeFromCart,getCart,getUserProfile}