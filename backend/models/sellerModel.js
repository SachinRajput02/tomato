import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String, 
      required: false,
      validate: {
        validator: function (v) {
          // Regular expression for validating phone numbers
          return /^[+\d]?(?:[\d-.\s()]*)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    fcmToken: { type: String },
    sellerCartData: { type: Object, default: {} },

  },
  { timestamps: true,minimize: false  },
  
);

const sellerModel =
  mongoose.models.seller || mongoose.model("Seller", sellerSchema);

export default sellerModel;
