import React, { useState, useContext } from "react";

import { StoreContext } from "../../components/context/StoreContext";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./List.css";
import Add from "../Add/Add";
import { assets } from "../../assets/assets";

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

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });

    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  return (
  <div className="all-list-container">
    <div className="list add flex-col ">
      <p>All Live Food List</p>
      <div className="list-table">
        <div className="list-table-format live title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Remove</b>
        </div>
        {food_list.map((item, index) => {
          if ((sellerCartItems[item._id] > 0) && (item.shopStatus==true)) {
            return (
              <React.Fragment key={item._id}>
                <div className="list-table-format" key={index}>
                  <img src={`${url}/images/` + item.image} alt="" />

                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>${item.price}</p>
                  <p
                    onClick={() => {
                      // changeShopFoodStatus(item._id);
                      removeFood(item._id);
                      removeFromSellerCart(item._id);
                      
                    }}
                    className="remove-icon"
                  >
                    X
                  </p>
                </div>
              </React.Fragment>
            );
          }
          return null;
        })}
      </div>
    </div>
    <div className="list add flex-col ">
      <p>All Ofline Food List</p>
      <div className="list-table">
        <div className="list-table-format without-live title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Add</b>
          <b>Remove</b>
        </div>
        {food_list.map((item, index) => {
          if (sellerCartItems[item._id] > 0&& (item.shopStatus==false)) {
            return (
              <React.Fragment key={item._id}>
                <div className="list-table-format without-live" key={index}>
                  <img src={`${url}/images/` + item.image} alt="" />

                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>${item.price}</p>
                  <p
                    onClick={() => {
                      changeShopFoodStatus(item._id);
                    }}
                    className="add-icon"
                  >
                    <img src={assets.add_icon} alt="" />
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
              </React.Fragment>
            );
          }
          return null;
        })}
      </div>
    </div>
    </div>
  );
  
};


export default List;
