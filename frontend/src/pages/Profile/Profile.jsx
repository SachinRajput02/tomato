import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Profile.css";

import { assets } from "../../assets/assets";
import { StoreContext } from "../../components/context/StoreContext";
import axios from "axios";


const Profile = () => {
  const { token, url, userData,
  setUserData,loadUserProfileData} = useContext(StoreContext);
  const [editProfile, setEditProfile] = useState("Update");
  const [userImage, setUserImage] = useState(null);

  const [userAddData, setUserAddData] = useState({
    firstName: "",
    lastName: "",
    addEmail: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    addPhone: "",
  });

  const handleEditClick = () => {
    if (editProfile === "Update") {
      // Fill userAddData with values from userData.address
      setUserAddData({
        firstName: userData.address.firstName || "",
        lastName: userData.address.lastName || "",
        addEmail: userData.address.addEmail || "",
        street: userData.address.street || "",
        city: userData.address.city || "",
        state: userData.address.state || "",
        zipcode: userData.address.zipcode || "",
        country: userData.address.country || "",
        addPhone: userData.address.addPhone || "",
      });
  
      setEditProfile("Save");
    } else {
      setEditProfile("Update");
    }
  };
  

  // Handler for input changes
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserAddData((userAddData) => ({ ...userAddData, [name]: value }));
  };



  // Update user profile data
  const updateUserProfileData = async () => {
    try {
      const response = await axios.post(
        `${url}/api/userprofile/updateUserProfile`,
        { ...userAddData },
        { headers: { token } }
      );

      if (userImage) {
        const formData = new FormData();
        formData.append("profilePic", userImage);

        const imgUploadRes = await axios.put(
          `${url}/api/userProfile/updateUserImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              token: token,
            },
          }
        );

        if (imgUploadRes.data.success) {
          toast("user image updated!");
        } else {
          toast("Image update failed.");
          console.log(imgUploadRes.data.message);
        }
      }


      if (response.data.success) {
        toast("Profile updated successfully!");
      } else {  
        toast("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user profile data:", error.message);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }else{
      toast.error("Please login to view your profile.");
    }
  }, [token, loadUserProfileData]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="user-profile">
      <h2>Hello,{userData.name}</h2>

      <div className="profile-header">
          <div className="image-section">
                  <img
  className="profile-pic"
  src={
    userImage
      ? URL.createObjectURL(userImage)
      : userData.profilePic
      ? userData.profilePic
      : assets.default_profile_pic
  }
  onError={(e) => { 
    e.target.src = assets.default_profile_pic;
  }}
  alt="user Pic"
/>

                  {editProfile === "Save" && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUserImage(e.target.files[0])}
                    />
                  )}
                </div>
        {/* <img
          className="profile-pic"
          src={assets.default_profile_pic  } // Default image if not available
          alt="Profile"
        /> */}
        
        {editProfile === "Update" ?<button onClick={handleEditClick} className="edit-profile">Edit Profile</button>:<button onClick={()=>{updateUserProfileData();handleEditClick();}} className="edit-profile">Save</button> }
        
      </div>

      <div className="info">
        <p><strong>Name:</strong> {userData.name || "Loading..."}</p>
        <p>
          <strong>Email:</strong> {userData.email || "Loading..."}
        </p>
        <p>
          <strong>Phone:</strong> {userData.phone || "not provided"}
        </p>
      </div>

      <div className="address-section">
        <h2>Address</h2>
        <div className="address-card">
          <div className="details">
            <div className="Address-Info">
              <p className="title">Delivery Information</p>
              <div className="multi-fields">
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="firstName"
                  onChange={onChangeHandler}
                  value={userAddData.firstName}
                  type="text"
                  placeholder={`${!userData.address.firstName?"First name":userData.address.firstName}`}
                />
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="lastName"
                  onChange={onChangeHandler}
                  value={userAddData.lastName}
                  type="text"
                  placeholder={`${!userData.address.lastName?"Last name":userData.address.lastName}`}
                />
              </div>
              <input
                required
                disabled={editProfile === "Update"}
                name="addEmail"
                onChange={onChangeHandler}
                value={userAddData.addEmail}
                type="email"
                placeholder={`${!userData.address.addEmail?"Email":userData.address.addEmail}`}
              />
              <input
                required
                disabled={editProfile === "Update"}
                name="street"
                onChange={onChangeHandler}
                value={userAddData.street}
                type="text"
                placeholder={`${!userData.address.street?"Street":userData.address.street}`}
              />
              <div className="multi-fields">
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="city"
                  onChange={onChangeHandler}
                  value={userAddData.city}
                  type="text"
                  placeholder={`${!userData.address.city?"City":userData.address.city}`}
                />
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="state"
                  onChange={onChangeHandler}
                  value={userAddData.state}
                  type="text"
                  placeholder={`${!userData.address.state?"State":userData.address.state}`}
                />
              </div>
              <div className="multi-fields">
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="zipcode"
                  onChange={onChangeHandler}
                  value={userAddData.zipcode}
                  type="text"
                  placeholder={`${!userData.address.zipcode?"Zipcode":userData.address.zipcode}`}
                />
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="country"
                  onChange={onChangeHandler}
                  value={userAddData.country}
                  type="text"
                  placeholder={`${!userData.address.country?"Country":userData.address.country}`}
                />
              </div>
              <input
                required
                disabled={editProfile === "Update"}
                name="addPhone"
                onChange={onChangeHandler}
                value={userAddData.addPhone}
                type="text"
                placeholder={`${!userData.address.addPhone?"Address Phone no.":userData.address.addPhone}`}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
