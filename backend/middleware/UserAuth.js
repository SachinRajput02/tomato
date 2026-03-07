import jwt from "jsonwebtoken"

const userAuthMiddleware = async(req,res,next)=>{
    const token = req.headers.token;
    if(!token){
        return res.json({success:false,message:"Not Authorized Login Again"})
    }
    try{
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = token_decode.id;
        next();
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error in authing user"})
    }


}

export default userAuthMiddleware;