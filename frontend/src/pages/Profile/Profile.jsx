import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../components/context/StoreContext";
import axios from "axios";

const Profile = () => {
  const { token, url } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    profilePic: "",
    registrationDate: "",
  });

  // Fetch user profile data
  const loadUserProfileData = async () => {
    try {
      const response = await axios.post(
        `${url}/api/cart/userprofile`,
        {},
        { headers: { token } }
      );
      const {
        name,
        email,
        phone,
        address1,
        address2,
        profilePic,
        registrationDate,
      } = response.data;

      setUserData({
        name,
        email,
        phone,
        address1,
        address2,
        profilePic: profilePic || assets.sachin_image, // Use default if not available
        registrationDate,
      });
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
    <div className="user-profile">
      <h2>Hello,{userData.name}</h2>

      <div className="profile-header">
        <img
          className="profile-pic"
          src={userData.profilePic || assets.default_profile_pic} // Default image if not available
          alt="Profile"
        />
        <button className="edit-profile">Edit Profile</button>
      </div>

      <div className="info">
        {/* <p><strong>Name:</strong> {userData.name || "Loading..."}</p> */}
        <p>
          <strong>Email:</strong> {userData.email || "Loading..."}
        </p>
        <p>
          <strong>Phone:</strong> {userData.phone || "not provided"}
        </p>
        {/* <p><strong>Address 1:</strong> {userData.address1 || "not provided"}</p> */}
        {/* <p><strong>Address 2:</strong> {userData.address2 || "not provided"}</p> */}
        <p>
          <strong>Registered On:</strong>{" "}
          {userData.registrationDate || "Loading..."}
        </p>
      </div>

      <div className="order-history">
        <h2>Address</h2>

        <div className="address-card">
          <div className="details">
            <p>
              <strong>Address 1</strong>
            </p>
            <div className="Address-Info">
              <p className="title">Delivery Information</p>
              <div className="multi-fields">
                <input
                  required
                  name="firstName"
                  onChange={onChangeHandler}
                  value={data.firstName}
                  type="text"
                  placeholder="First name"
                />
                <input
                  required
                  name="lastName"
                  onChange={onChangeHandler}
                  value={data.lastName}
                  type="text"
                  placeholder="Last name"
                />
              </div>
              <input
                required
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="Email address"
              />
              <input
                required
                name="street"
                onChange={onChangeHandler}
                value={data.street}
                type="text"
                placeholder="Street"
              />
              <div className="multi-fields">
                <input
                  required
                  name="city"
                  onChange={onChangeHandler}
                  value={data.city}
                  type="text"
                  placeholder="City"
                />
                <input
                  required
                  name="state"
                  onChange={onChangeHandler}
                  value={data.state}
                  type="text"
                  placeholder="State"
                />
              </div>
              <div className="multi-fields">
                <input
                  required
                  name="zipcode"
                  onChange={onChangeHandler}
                  value={data.zipcode}
                  type="text"
                  placeholder="Pin code"
                />
                <input
                  required
                  name="country"
                  onChange={onChangeHandler}
                  value={data.country}
                  type="text"
                  placeholder="Country"
                />
              </div>
              <input
                required
                name="phone"
                onChange={onChangeHandler}
                value={data.phone}
                type="text"
                placeholder="Phone No."
              />
            </div>
            <button className="reorder">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// import React, { useContext, useEffect, useState } from "react";
// import "./Profile.css";
// import { assets } from "../../assets/assets";
// import { StoreContext } from "../../components/context/StoreContext";
// import axios from "axios";

// const Profile = () => {
//   const { token, url } = useContext(StoreContext);
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   // Fetch user profile data
//   const loadUserProfileData = async () => {
//     try {
//       const response = await axios.post(
//         `${url}/api/cart/userprofile`,
//         {},
//         { headers: { token } }
//       );
//       const { name, email, phone } = response.data;

//       // Update state with fetched data
//       setUserData({ name, email, phone });
//     } catch (error) {
//       console.error("Error fetching user profile data:", error.message);
//     }
//   };

//   // Fetch data when the component mounts
//   useEffect(() => {
//     if (token) {
//       loadUserProfileData();
//     }
//   }, [token]);

//   return (
//     <div>
//       <div className="user-profile">
//         <h1>User Profile</h1>
//         <img
//           className="profile-pic"
//           src={assets.sachin_image}
//           alt="Profile Picture"
//         />

//         <div className="info">
//           <p>
//             <strong>Name:</strong> {userData.name || "Loading..."}
//           </p>
//           <p>
//             <strong>Email:</strong> {userData.email || "Loading..."}
//           </p>
//           <p>
//             <strong>Phone:</strong> {userData.phone || "Loading..."}
//           </p>
//         </div>

//         <div className="order-history">
//           <h2>Order History</h2>

//           <div className="order-card">
//             <div className="details">
//               <p>
//                 <strong>Order #12345</strong>
//               </p>
//               <p>Shop: Delicious Eats</p>
//               <p>Date: 2025-01-15</p>
//             </div>
//             <button className="reorder">Reorder</button>
//           </div>

//           <div className="order-card">
//             <div className="details">
//               <p>
//                 <strong>Order #12346</strong>
//               </p>
//               <p>Shop: Tasty Bites</p>
//               <p>Date: 2025-01-10</p>
//             </div>
//             <button className="reorder">Reorder</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
