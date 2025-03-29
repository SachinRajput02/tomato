import mongoose from "mongoose";
const userSchema =new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phone: {
        type: String, 
        required: true,
        validate: {
          validator: function (v) {
            // Regular expression for validating phone numbers
            return /^[+\d]?(?:[\d-.\s()]*)$/.test(v);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
    cartData:{type:Object,default:{}},
      
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;