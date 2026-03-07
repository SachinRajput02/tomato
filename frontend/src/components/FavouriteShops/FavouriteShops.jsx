//  UPDATED FavouriteShops.jsx

import React, { useContext, useEffect,useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";
import '../NearbyShopsComponent/NearbyShopsComponent.css';
import './FavouriteShops.css';

const FavouriteShops = () => {

  const { fav_Shops, setFav_Shops, url, token, shopNamesArray, setShopNamesArray ,getCurrentLocation} = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [favouritesShop, setFavouritesShop] = useState(false);

  useEffect(() => {
    if (location.pathname === '/manageShops') {
      setShopNamesArray(fav_Shops.map((shop) => shop.shopName));
    }
  }, [fav_Shops]);
    useEffect(() => {
    const fetchFavourites = async () => {
      try {
        console.log("Fetching favourite shops...", token);
        const res = await axios.post(
          `${url}/api/findShop/getFavouriteShops`,
          {},
          { headers: { token } }
        );
        console.log("Response from getFavouriteShops:", res.data);
        const parsedData =
          typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        const favShops = Array.isArray(parsedData) ? parsedData : [];
        console.log("Parsed favourite shops:", favShops);
        if (favShops.length > 0) {
          setFavouritesShop(true);
        } else {
          setFavouritesShop(false);
        }
      } catch (err) {
        console.error("Error fetching favourite shops or nearest shops", err);
        setFavouritesShop(false);
      }
    };

    fetchFavourites();
  }, []);

  const removeFavourite = async (sellerId) => {
    try {
      const res = await fetch(`${url}/api/findShop/removeFromFavourites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({ sellerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
      } else if (!token) {
        toast.error("Please login to remove favourite shop!");
      } else {
        setFav_Shops((prev) => prev.filter((shop) => shop._id !== sellerId));
        toast.success("Shop removed from favourites!");
      }
    } catch (err) {
      console.error('Error removing favourite:', err);
    }
  };
   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="nearby-container">
      <h2>Favourite Shops</h2>

      {!favouritesShop || !token ? (
        <div className="no-favourites">
          <br />
          <h3>No favourite shops found!</h3>
          <p>Looks like you haven't added any shops to your favourites yet.</p>
          <p>Browse nearby shops and tap the ❤️ icon to save them here for quick access!</p>

          <button onClick={() => navigate('/nearbyShops')}>Add Favourite</button>
        </div>
      ) : (
        <div className="shop-card-container">
          {fav_Shops.map((shop, idx) => (
            <div
              className="shop-card"
              key={idx}
              onClick={() =>
                navigate('/ShopProfile', {
                  state: { shopName: shop.shopName, shopId: shop._id },
                })
              }
            >
              <img
                src={
                  shop.shopPic
                    ? shop.shopPic
                    : "https://via.placeholder.com/150"
                }
                alt={shop.shopName}
                className="shop-img"
              />
              <div className="shop-info">
              <div className="food-shop-item-name-rating ">
                <p>{shop.shopName}</p>
                <ul className="rating">
                  <li>{shop.rating}</li>
                  <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#fff"><path d="m384-334 96-74 96 74-36-122 90-64H518l-38-124-38 124H330l90 64-36 122ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Zm247-369Z"/></svg>
                </ul>
              </div>

              <button
                className="heart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavourite(shop._id);
                }}
              >
                {fav_Shops.some((f) => f._id === shop._id) ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouriteShops;

