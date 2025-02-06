import React, { useState, useContext ,useEffect} from "react";
import "./Add.css";
import axios from "axios";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { StoreContext } from "../../components/context/StoreContext";

const Add = (id,itemId) => {

  const {
    sellerToken,
    fetchShopName,
    url,
    sellerCartItems,
    addToSellerCart,
    removeFromSellerCart,
  } = useContext(StoreContext);

  
  if (localStorage.getItem("sellerToken")) {
    console.log("sellerToken hai");

  } else {
    console.log(localStorage.getItem("sellerToken"));
    console.log("sellerToken nahi  hai");
  }
  

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    shopname:"",
  });

  // Fetch shop name when the component mounts
  useEffect(() => {
    const getShopName = async () => {
      try {
        const shopName = await fetchShopName();
        setData((prevData) => ({ ...prevData, shopname: shopName }));
      } catch (error) {
        console.error("Error fetching shop name:", error);
      }
    };
    getShopName();
  }, [fetchShopName]);


  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("shopname", data.shopname);
    formData.append("image", image);
    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: { sellerToken },
      });

      if (response.data.success) {
        // Call addToSellerCart to update sellerCartData with the new food item
        const itemId = response.data.itemId; // Ensure the backend returns the item's ID
        addToSellerCart(itemId);
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
          shopname:data.shopname,
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding food:", error.message);
      toast.error("Failed to add food. Please try again.");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex col">
            <p>Product category</p>
            <select onChange={onChangeHandler} name="category">
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
              <option value=""></option>
            </select>
          </div>
          <div className="add-price flex -col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="$20"
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;






// import React, { useState } from "react";
// import "./Add.css";

// import axios from "axios";
// import { assets } from "../../assets/assets";
// import { toast } from "react-toastify";

// const Add = ({ url }) => {

//   const params = new URLSearchParams(window.location.search);
// const token = params.get("token");

//   if (token) {
//     localStorage.setItem("sellerToken", token);
//     console.log("token hai");
//   }
//   else{
//     console.log("token nahi hai");
//   }
//   console.log(localStorage.getItem("sellerToken"));

//   const [image, setImage] = useState(false);
//   const [data, setData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "Salad",
//   });

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData((data) => ({ ...data, [name]: value }));
//   };

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("description", data.description); // Fixed the typo here
//     formData.append("price", Number(data.price));
//     formData.append("category", data.category);
//     formData.append("image", image);

//     try {
//       const token = localStorage.getItem("sellerToken");

//       const response = await axios.post(`${url}/api/food/add`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         // Reset the form fields after successful submission
//         setData({
//           name: "",
//           description: "",
//           price: "",
//           category: "Salad",
//         });
//         setImage(false);
//         toast.success(response.data.message);
//       } else {
//         alert("Failed to add product.");
//       }
//     } catch (error) {
//       console.error("Error while submitting:", error);
//       alert("Failed to add product, please try again!");
//     }
//   };

//   return (
//     <div className="add">
//       <form className="flex-col" onSubmit={onSubmitHandler}>
//         <div className="add-img-upload flex-col">
//           <p>Upload Image</p>
//           <label htmlFor="image">
//             <img
//               src={image ? URL.createObjectURL(image) : assets.upload_area}
//               alt=""
//             />
//           </label>
//           <input
//             onChange={(e) => setImage(e.target.files[0])}
//             type="file"
//             id="image"
//             hidden
//             required
//           />
//         </div>
//         <div className="add-product-name flex-col">
//           <p>Product name</p>
//           <input
//             onChange={onChangeHandler}
//             value={data.name}
//             type="text"
//             name="name"
//             placeholder="Type here"
//           />
//         </div>
//         <div className="add-product-description flex-col">
//           <p>Product description</p>
//           <textarea
//             onChange={onChangeHandler}
//             value={data.description}
//             name="description"
//             rows="6"
//             placeholder="Write content here"
//           ></textarea>
//         </div>
//         <div className="add-category-price">
//           <div className="add-category flex col">
//             <p>Product category</p>
//             <select onChange={onChangeHandler} name="category">
//               <option value="Salad">Salad</option>
//               <option value="Rolls">Rolls</option>
//               <option value="Deserts">Deserts</option>
//               <option value="Sandwich">Sandwich</option>
//               <option value="Cake">Cake</option>
//               <option value="Pure Veg">Pure Veg</option>
//               <option value="Pasta">Pasta</option>
//               <option value="Noodles">Noodles</option>
//             </select>
//           </div>
//           <div className="add-price flex -col">
//             <p>Product Price</p>
//             <input
//               onChange={onChangeHandler}
//               value={data.price}
//               type="Number"
//               name="price"
//               placeholder="$20"
//             />
//           </div>
//         </div>
//         <button type="submit" className="add-btn">
//           Add
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Add;
