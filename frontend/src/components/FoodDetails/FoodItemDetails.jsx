// src/pages/FoodItemDetails.jsx
import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./FoodItemDetails.css";
import { StoreContext } from "../context/StoreContext";
import Review from "../Reviews/Reviews.jsx";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";


const FoodItemDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const [tab, setTab] = useState("description");
  const [reviews, setReviews] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const {
    foodName,
    foodId,
    shopName,
    foodPrice,
    foodImage,
    foodDescription,
    foodRating,
    shopId,
    foodDistance,
  } = location.state || {};

  const fetchReviews = async () => {
    setLoadingReviews(true);
    setReviewError("");
    try {
      const response = await fetch(`${url}/api/review/Food/${foodId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }
      setReviews(data);
    } catch (error) {
      setReviewError(error.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (tab === "Reviews" && reviews === null) {
      fetchReviews();
    }
  }, [tab]);

  return (
    <div className="food-details-container">
      <h1>Food Details</h1>
      <div className="image-details-container">
        <div className="food-image-conatiner ">
          <img
            src={foodImage}
            alt={foodName}
            className="food-image"
          />
        </div>
        <div className="food-item-info food-item-info-fooddetails">
          <div className="food-shop-item-name-rating">
            <p>{foodName}</p>
            <ul className="rating">
              <li>{foodRating}</li>
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
          <div className="price-distance"><div className="shop-name">
            By:
             <h3
            onClick={(e) => {
              navigate("/ShopProfile", {
                state: { shopName: shopName, shopId: shopId },
              });
            }}
          >
             {shopName}
          </h3>
          </div>
          <p className="distance">{foodDistance}km</p></div>
          
          
          <div className="price-addtocart-button">
            <p className="food-item-price">₹ {foodPrice}</p>
            {!cartItems[foodId] ? (
              // <img
              //   onClick={(e) => {
              //     e.stopPropagation();
              //     addToCart(foodId);
              //   }}
              //   src={assets.add_icon_white}
              //   alt=""
              //   className="add"
              // />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(foodId);
                }}
                src={assets.add_icon_white}
                alt=""
                className="add"
              >
                AddToCart
              </button>
            ) : (
              <div className="food-item-counter food-item-counter-fooddetails">
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(foodId);
                  }}
                  src={assets.remove_icon_red}
                  alt=""
                />
                <p>{cartItems[foodId]}</p>
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(foodId);
                  }}
                  src={assets.add_icon_green}
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tabs-filter-switches-ControlBar food-details-tabs">
        <ul />
        <li
          className={tab === "Reviews" ? "active" : ""}
          onClick={() => setTab("Reviews")}
        >
          Reviews
        </li>
        <li
          className={tab === "description" ? "active" : ""}
          onClick={() => setTab("description")}
        >
          description
        </li>
        <li
          className={tab === "photos" ? "active" : ""}
          onClick={() => setTab("photos")}
        >
          photos
        </li>
        
      </div>

      <hr />
      <div className="description-photos-Reviews">
        <div className={tab === "description" ? "activetab" : "nonactivetab"}>
          <p>{foodDescription}</p>
        </div>

        <div className={tab === "photos" ? "activetab" : "nonactivetab"}>
          <p>No photos available</p>
        </div>

        <div className={tab === "Reviews" ? "activetab" : "nonactivetab"}>
          <p>The {foodName} Reviews</p>
          {loadingReviews ? (
            <p>Loading reviews...</p>
          ) : reviewError ? (
            console.error(reviewError)
          ) : reviews && reviews.length > 0 ? (
            <ul>
              {reviews.map((review, index) => {
                return (
                  <Review
                    key={review._id}
                    targetId={review.targetId}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                    user={review.user}
                  />
                );
              })}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemDetails;
