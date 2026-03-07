import React, { useContext, useEffect, useState } from "react";
import "./Fooditem.css";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";

const Fooditem = ({
  id, 
  name,
  price,
  description,
  image,
  shopname,
  shopId,
  rating,
}) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, url, getCurrentLocation } =
    useContext(StoreContext);

  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const fetchShopLocation = async () => {
      try {
        const position = await getCurrentLocation();
        const res = await axios.post(
          `${url}/api/sellerProfile/getShopLocation`,
          {
            longitude: position.longitude,
            latitude: position.latitude,
            shopId: shopId,
          }
        );
        if (res.data && res.data.distance) {
          setDistance(res.data.distance);
        }
      } catch (err) {
        setDistance(null);
      }
    };
    fetchShopLocation();
  }, [getCurrentLocation, url, shopId]);

  return (
    <div className="food-item">
      <div className="food-item-card-container">
        <div className="food-item-img-container">
          <img
            onClick={() =>
              navigate("/FoodProfile", {
                state: {
                  foodId: id,
                  foodName: name,
                  foodPrice: price,
                  foodDescription: description,
                  foodImage: image,
                  shopName: shopname,
                  shopId: shopId,
                  foodRating: rating,
                  foodDistance: distance,
                },
              })
            }
            src={image}
            alt="not available"
            className="food-item-image"
          />
          {!cartItems[id] ? (
            <>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(id);
                }}
                src={assets.add_icon_white}
                alt=""
                className="add"
              />
            </>
          ) : (
            <div className="food-item-counter">
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(id);
                }}
                src={assets.remove_icon_red}
                alt=""
              />
              <p>{cartItems[id]}</p>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(id);
                }}
                src={assets.add_icon_green}
                alt=""
              />
            </div>
          )}
        </div>

        <div className="food-item-info">
          <div className="food-shop-item-name-rating">
            <p>{name}</p>
            <ul className="rating">
              <li>{rating}</li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="15px"
                viewBox="0 -960 960 960"
                width="15px"
                fill="#fff"
              >
                <path d="m384-334 96-74 96 74-36-122 90-64H518l-38-124-38 124H330l90 64-36 122ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Zm247-369Z" />
              </svg>
            </ul>
          </div>
          <div className="shop-name">
            By:
             <h3
            onClick={(e) => {
              navigate("/ShopProfile", {
                state: { shopName: shopname, shopId: shopId },
              });
            }}
          >
             {shopname}
          </h3>
          </div>
          
          <div className="price-distance">
            <p className="food-item-price">₹ {price}</p>
            <p className="distance">
              {distance !== null ? `${distance} km away` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;





// import React, { useContext, useEffect } from "react";
// import "./Fooditem.css";
// import { useNavigate } from "react-router-dom";
// import { assets } from "../../assets/assets";
// import { StoreContext } from "../context/StoreContext";
// import axios from "axios";


// const Fooditem = ({
//   id, 
//   name,
//   price,
//   description,
//   image,
//   shopname,
//   shopId,
//   rating,
// }) => {
//   const navigate = useNavigate();
//   const { cartItems, addToCart, removeFromCart, url, getCurrentLocation } =
//     useContext(StoreContext);

//   useEffect(() => {
//     const fetchShopLocation = async () => {
//       const position = await getCurrentLocation();
//       const getShopLocation = await axios.post(
//         `${url}/api/findShop/findNearestXShops`,
//         {
//           longitude: position.longitude,
//           latitude: position.latitude,
//           shopId: shopId,
//         }
//       );
//       // handle getShopLocation as needed
//     };
//     fetchShopLocation();
//   }, [getCurrentLocation, url, shopId]);

//   return (
//     <div
//       className="food-item"
//     >
//       <div className="food-item-card-container">
//         <div className="food-item-img-container">
//           <img
//           onClick={() =>
//         navigate("/FoodProfile", {
//           state: {
//             foodId: id,
//             foodName: name,
//             foodPrice: price,
//             foodDescription: description,
//             foodImage: image,
//             shopName: shopname,
//             shopId:shopId,
//             foodRating: rating,
//           },
//         })
//       }
//             src={image}
//             alt="not available"
//             className="food-item-image"
//           />
//           {!cartItems[id] ? (
//             <>
//               <img
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   addToCart(id);
//                 }}
//                 src={assets.add_icon_white}
//                 alt=""
//                 className="add"
//               />
//             </>
//           ) : (
//             <div className="food-item-counter">
//               <img
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   removeFromCart(id);
//                 }}
//                 src={assets.remove_icon_red}
//                 alt=""
//               />
//               <p>{cartItems[id]}</p>
//               <img
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   addToCart(id);
//                 }}
//                 src={assets.add_icon_green}
//                 alt=""
//               />
//             </div>
//           )}
//         </div>

//         <div className="food-item-info">
//           <div className="food-shop-item-name-rating">
//             <p>{name}</p>
//             <ul className="rating">
//               <li>{rating}</li>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 height="15px"
//                 viewBox="0 -960 960 960"
//                 width="15px"
//                 fill="#fff"
//               >
//                 <path d="m384-334 96-74 96 74-36-122 90-64H518l-38-124-38 124H330l90 64-36 122ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Zm247-369Z" />
//               </svg>
//               {/* ⭐  */}
//             </ul>
//           </div>
//           <h3 onClick={(e) =>{
//                 navigate('/ShopProfile', {
//                   state: { shopName: shopname, shopId:shopId},
//                 })}
//               }>by: {shopname}</h3>
//           {/* <p className="food-item-desc">{description}</p> */}
//           <div className="price-rating">
//             <p className="food-item-price">₹ {price}</p>
//             <p className="distance"></p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Fooditem;