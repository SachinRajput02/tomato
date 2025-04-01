import React from 'react'
import userModel from "../models/userModel.js";

const getUserProfile = async (req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let name = await userData.name;
        let email = await userData.email;
        let phone = await userData.phone;
        let address= await userData.address;
        
        res.json({success:true,name,email,phone,address})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error to getting user profile details"})
    }
}


export {getUserProfile}
