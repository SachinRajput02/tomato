import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../components/context/StoreContext";
import axios from "axios";

const Profile = () => {
  const { token, url } = useContext(StoreContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch user profile data
  const loadUserProfileData = async () => {
    try {
      const response = await axios.post(
        `${url}/api/cart/userprofile`,
        {},
        { headers: { token } }
      );
      const { name, email, phone } = response.data;

      // Update state with fetched data
      setUserData({ name, email, phone });
    } catch (error) {
      console.error("Error fetching user profile data:", error.message);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  return (
    <div>
      <div className="user-profile">
        <h1>User Profile</h1>
        <img
          className="profile-pic"
          src={assets.sachin_image}
          alt="Profile Picture"
        />

        <div className="info">
          <p>
            <strong>Name:</strong> {userData.name || "Loading..."}
          </p>
          <p>
            <strong>Email:</strong> {userData.email || "Loading..."}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phone || "Loading..."}
          </p>
        </div>

        <div className="order-history">
          <h2>Order History</h2>

          <div className="order-card">
            <div className="details">
              <p>
                <strong>Order #12345</strong>
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
