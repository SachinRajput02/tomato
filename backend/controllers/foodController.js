import foodModel from "../models/foodModel.js";
import sellerModel from "../models/sellerModel.js";
import fs from 'fs';




// correct and my addFood function
// add food item
const addFood = async (req, res) => {
    // Use correct template literal syntax
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
        shopname:req.body.shopname,
        
    });

    try {
        // Use res.json() to send the response
        await food.save();
        res.json({ success: true, message: "Food Added",itemId:food._id });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


//find sellers food
const listsellerFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// remove food item
const changeShopFoodStatus = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food) {
            const updatedStatus = !food.shopStatus;
            

            await foodModel.findByIdAndUpdate(req.body.id,{shopStatus:updatedStatus});
            res.json({ success: true, message: "Food Removed From Live Foods" });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating shopStatus" });
    }
};





// remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food) {
            // Corrected fs.unlink to use template literals correctly
            fs.unlink(`uploads/${food.image}`, () => {});

            await foodModel.findByIdAndDelete(req.body.id);
            res.json({ success: true, message: "Food Removed" });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


export {addFood, listFood,listsellerFood, removeFood ,changeShopFoodStatus};






// code for authrization

// import foodModel from "../models/foodModel.js";
// import fs from 'fs';
// import jwt from "jsonwebtoken";

// // add food item

// const addFood = async(req,res)=>{
    
//     try {
//         // 1. Get the token from Authorization header
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
//         }

//         const sellerToken = authHeader.split(" ")[1]; // Extract token part
//         if (!sellerToken) {
//             return res.status(401).json({ success: false, message: "Unauthorized: Invalid token format" });
//         }

//         // 2. Verify token
//         const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
//         const sellerId = decoded.id;

//         // 3. Handle Image
//         let image_filename = `${req.file.filename}`;

//         // 4. Create new food item
//         const food = new foodModel({
//             name: req.body.name,
//             description: req.body.description,
//             price: req.body.price,
//             category: req.body.category,
//             image: image_filename,
//             seller: sellerId
//         });

//         // 5. Save to database
//         await food.save();
//         res.json({ success: true, message: "Food Added" });

//     } catch (error) {
//         console.error("Error adding food:", error);
        
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ success: false, message: "Invalid token" });
//         }

//         res.status(500).json({ success: false, message: "Error in adding food" });
//     }
// };





// //   const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
// //   const sellerId = decoded.id;

// //     let image_filename=`${req.file.filename}`

// //     const food = new foodModel({
// //         name:req.body.name,
// //         description:req.body.description,
// //         price:req.body.price,
// //         category:req.body.category,
// //         image:image_filename,
// //         seller: sellerId
// //     })
// //     try{
// //         await food.save();
// //         res.json({success:true,message:"Food Added"})
// //     }catch(error){
// //         console.log(error)
// //         res.json({success:false,message:"Error in adding food"})
// //     }


// // List Seller's Food
// const listFood = async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
        
//         // Check if Authorization header exists
//         // if (!authHeader) {
//         //     return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
//         // }

//         // const sellerToken = authHeader.split(" ")[1];
//         // const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
//         // const sellerId = decoded.id;

//         // Fetch food list if the user is authenticated
//         const foods = await foodModel.find({});
//         res.json({ success: true, data: foods });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Error fetching food list" });
//     }
// }



// // const listFood =async (req,res)=>{
// //     const token = req.headers.authorization.split(" ")[1];
   
    
// //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //   const sellerId = decoded.id;
// //     try{
        
// //         const foods = await foodModel.find({seller:sellerId});
// //         res.json({success:true,data:foods})
// //     }catch(error){
// //     console.log(error);
// //     res.json({success:false,message:"Error fetching food list"})
// //     }
// // } 

// //remove food item

// const removeFood = async(req,res)=>{

//     try{
//         const food = await foodModel.findById(req.body.id);
//         fs.unlink(`uploads/${food.image}`,()=>{})

//         await foodModel.findByIdAndDelete(req.body.id);
//         res.json({success:true,message:"Food Removed"})
        
//     }catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error removing food"})
//     }
// }

// export {addFood,listFood,removeFood}