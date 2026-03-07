import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date : {type:Date,default:Date.now()},
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[+\d]?(?:[\d-.\s()]*)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    profilePic: { type: String, default: "" },
    address: {
      type: Object,
      default: {
        firstName: "",
        lastName: "",
        addEmail: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        addPhone: "",
      },
    },
    cartData: { type: Object, default: {} },
    favouriteShops: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    }],
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;



