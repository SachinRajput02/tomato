import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../components/context/StoreContext";
import axios from "axios";

const Profile = () => {
  const { sellerToken, url } = useContext(StoreContext);
  const [sellerData, setSellerData] = useState({
    name: "",
    email: "",
    phone: "",
    shopName: "",
  });

  // Fetch user profile data
  const loadSellerProfileData = async () => {
    try {
      const response = await axios.post(
        `${url}/api/sellerCart/sellerProfile`,
        {},
        { headers: { sellerToken } }
      );
      const { name, email, phone, shopName } = response.data;

      // Update state with fetched data
      setSellerData({ name, email, phone, shopName });
    } catch (error) {
      console.error("Error fetching user profile data:", error.message);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (sellerToken) {
      loadSellerProfileData();
    }
  }, [sellerToken]);

  return (
    <div>
      <div className="seller-profile">
        <h1>{sellerData.shopName} Profile</h1>
        <img
          className="profile-pic"
          src={assets.shop_img}
          alt="Profile Picture"
        />

        <div className="info">
          <p>
            <strong>Owner:</strong> {sellerData.name || "Loading..."}
          </p>
          <p>
            <strong>Email:</strong> {sellerData.email || "Loading..."}
          </p>
          <p>
            <strong>Phone:</strong> {sellerData.phone || "Loading..."}
          </p>
        </div>

        <div className="order-history">
          <h2>TO DO</h2>

          <div className="order-card">
            <div className="details">
              <p>
                <strong>TO do</strong>
              </p>
              <p>Shop: Delicious Eats</p>
              <p>Date: 2025-01-15</p>
            </div>
            <button className="reorder">Reorder</button>
          </div>

          <div className="order-card">
            <div className="details">
              <p>
                <strong>Order #12346</strong>
              </p>
              <p>Shop: Tasty Bites</p>
              <p>Date: 2025-01-10</p>
            </div>
            <button className="reorder">Reorder</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
