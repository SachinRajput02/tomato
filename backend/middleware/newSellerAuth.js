import jwt from "jsonwebtoken";

const sellerAuthMiddleware = async (req, res, next) => {
    const sellerToken  = req.headers.sellertoken;
  
    if (!sellerToken) {
      return res.json({ success: false, message: "Not Authorized seller Login Again" });
    }
    try {
      const sellerToken_decode = jwt.verify(sellerToken, process.env.JWT_SECRET);
      req.sellerId = sellerToken_decode.id;
      
      next();
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error in sellerAuthMiddleware" });
    }
  };
  export default sellerAuthMiddleware ;
