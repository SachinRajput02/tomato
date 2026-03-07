// config/multerCloudinary.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Generic upload — fallback: put everything in /misc if not specified
const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      //Dynamic folder based on field or route
      let folder = "misc_images";

      // If the route uses `profilePic`, store in `user_profile_images`
      if (file.fieldname === "shopPic") folder = "shop_profile_images";
      if (file.fieldname === "profilePic") folder = "user_profile_images";
      if (file.fieldname === "image") folder = "food_images";

      return {
        folder: folder,
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      };
    },
  }),
});

export default upload;

