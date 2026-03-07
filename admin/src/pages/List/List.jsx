import React, { useState, useContext } from "react";

import { StoreContext } from "../../components/context/StoreContext";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./List.css";
import { assets } from "../../assets/assets";

// ...imports remain the same

const List = () => {
  const {
    sellerToken,
    sellerCartItems,
    fetchFoodList,
    food_list,
    removeFromSellerCart,
    changeShopFoodStatus,
    url,
  } = useContext(StoreContext);

  useEffect(() => {
    fetchFoodList();

  }, []);

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  const liveItems = food_list.filter(
    (item) => sellerCartItems[item._id] > 0 && item.shopStatus === true
  );

  const offlineItems = food_list.filter(
    (item) => sellerCartItems[item._id] > 0 && item.shopStatus === false
  );

  return (
    <div className="all-list-container">
      {/* LIVE FOODS */}
      <div className="list add flex-col">
        <p>All Live Food List</p>
        <div className="list-table">
          <div className="list-table-format live title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Remove</b>
          </div>

          {liveItems.length > 0 ? (
            liveItems.map((item, index) => (
              <div className="list-table-format" key={index}>
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₹{item.price}</p>
                <p
                  onClick={() => {
                    changeShopFoodStatus(item._id)
                    // removeFood(item._id);
                    // removeFromSellerCart(item._id);
                  }}
                  className="remove-icon"
                >
                  X
                </p>
              </div>
            ))
          ) : (
            <div className="no-items">No live food items available.</div>
          )}
        </div>
      </div>

      {/* OFFLINE FOODS */}
      <div className="list add flex-col">
        <p>All Offline Food List</p>
        <div className="list-table">
          <div className="list-table-format without-live title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Add</b>
            <b>Remove</b>
          </div>

          {offlineItems.length > 0 ? (
            offlineItems.map((item, index) => (
              <div className="list-table-format without-live" key={index}>
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <p
                  onClick={() => changeShopFoodStatus(item._id)}
                  className="add-icon"
                >
                  <img src={assets.add_icon} alt="add-icon" />
                </p>
                <p
                  onClick={() => {
                    removeFood(item._id);
                    removeFromSellerCart(item._id);
                  }}
                  className="remove-icon"
                >
                  X
                </p>
              </div>
            ))
          ) : (
            <div className="no-items">No offline food items available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;

