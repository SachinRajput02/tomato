import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Profile.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../components/context/StoreContext";
import axios from "axios";

const Profile = () => {
  const { sellerToken, url } = useContext(StoreContext);
  const [editProfile, setEditProfile] = useState("Update");
  const [shopImage, setShopImage] = useState(null);

  const [message, setMessage] = useState("");
  const updateLocation = async () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(`${url}/api/sellerProfile/update-location`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              sellerToken: sellerToken,
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          const data = await res.json();
          if (res.ok) {
            setMessage("Location updated successfully!");
          } else {
            setMessage(data.error || "Error updating location");
          }
        } catch (err) {
          setMessage("Server error in frontend catch ");
        }
      },
      (err) => {
        setMessage("Location access denied or unavailable");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const [sellerEditData, setSellerEditData] = useState({
    baseDistance: 5,
    baseCharge: 20,
    perKmCharge: 5,
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
      // Fill sellerEditData with values from sellerData.address
      setSellerEditData({
        baseDistance: sellerData.deliveryCharges.baseDistance || 5,
        baseCharge: sellerData.deliveryCharges.baseCharge || 20,
        perKmCharge: sellerData.deliveryCharges.perKmCharge || 5,
        firstName: sellerData.address.firstName || "",
        lastName: sellerData.address.lastName || "",
        addEmail: sellerData.address.addEmail || "",
        street: sellerData.address.street || "",
        city: sellerData.address.city || "",
        state: sellerData.address.state || "",
        zipcode: sellerData.address.zipcode || "",
        country: sellerData.address.country || "",
        addPhone: sellerData.address.addPhone || "",
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
    setSellerEditData((sellerEditData) => ({
      ...sellerEditData,
      [name]: value,
    }));
  };

  const [sellerData, setSellerData] = useState({
    name: "",
    email: "",
    phone: "",
    shopName: "",
    deliveryCharges: {},
    address: {},
    shopPic: "",
  });

  // Fetch user profile data
  const loadSellerProfileData = async () => {
    try {
      const response = await axios.post(
        `${url}/api/sellerProfile/getSellerprofile`,
        {},
        { headers: { sellerToken } }
      );

      const {
        name,
        email,
        phone,
        shopName,
        deliveryCharges,
        address,
        shopPic,
      } = response.data;

      // Update state with fetched data
      setSellerData({
        name,
        email,
        phone,
        shopName,
        deliveryCharges,
        address,
        shopPic,
      });
    } catch (error) {
      console.error("Error fetching user profile data:", error.message);
    }
  };

  const updateSellerProfileData = async () => {
    try {
      await axios.post(
        `${url}/api/sellerprofile/updateSellerProfile`,
        { ...sellerEditData },
        { headers: { sellerToken } }
      );

      // Now upload the image if one was selected
      if (shopImage) {
        const formData = new FormData();
        formData.append("shopPic", shopImage);

        const imgUploadRes = await axios.put(
          `${url}/api/sellerprofile/updateShopImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              sellerToken: sellerToken,
            },
          }
        );

        if (imgUploadRes.data.success) {
          toast("Shop image updated!");
        } else {
          toast("Image update failed.");
          console.log(imgUploadRes.data.message);
        }
      }

      toast("Profile updated successfully!");
      loadSellerProfileData(); // Refresh the data
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast("Failed to update profile.");
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (sellerToken) {
      loadSellerProfileData();
    }
  }, [sellerToken]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="seller-profile">
      <h2>Hello, {sellerData.shopName}</h2>

      <div className="profile-header">
        <div className="image-section">
          <img
            className="profile-pic"
            src={
              shopImage
                ? URL.createObjectURL(shopImage)
                : sellerData.shopPic
                ? sellerData.shopPic
                : assets.shop_img
            }
            alt="Shop Picture"
          />
          {editProfile === "Save" && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setShopImage(e.target.files[0])}
            />
          )}
        </div>

        {/* <img className="profile-pic" src={assets.shop_img} alt="Shop Picture" /> */}
        {editProfile === "Update" ? (
          <button onClick={handleEditClick} className="edit-profile">
            Edit Profile
          </button>
        ) : (
          <button
            onClick={() => {
              updateSellerProfileData();
              handleEditClick();
            }}
            className="edit-profile"
          >
            Save
          </button>
        )}
      </div>

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
      <hr />

      <div className="address-section">
        <h2>Shop Information</h2>
        <div className="shop-location">
          <h3>Shop Location</h3>
          <button onClick={updateLocation}>Set My Current Location 📍</button>
          {message && <p>{message}</p>}
        </div>

        <div className="shop-delivery-charges-section">
          <h3>Shop Delivery Charges</h3>
          <p>
            baseDistance:
            <input
              disabled={editProfile === "Update"}
              required
              name="baseDistance"
              onChange={onChangeHandler}
              value={sellerData.baseDistance}
              type="number"
              placeholder={`${
                !sellerData.deliveryCharges.baseDistance
                  ? "Base distance in "
                  : sellerData.deliveryCharges.baseDistance
              }km`}
            />
          </p>
          <p>
            baseCharge:
            <input
              disabled={editProfile === "Update"}
              required
              name="baseCharge"
              onChange={onChangeHandler}
              value={sellerData.baseCharge}
              type="number"
              placeholder={`${
                !sellerData.deliveryCharges.baseCharge
                  ? "Base charge in "
                  : sellerData.deliveryCharges.baseCharge
              }₹`}
            />
          </p>
          <p>
            perKmCharge:
            <input
              disabled={editProfile === "Update"}
              required
              name="perKmCharge"
              onChange={onChangeHandler}
              value={sellerData.perKmCharge}
              type="number"
              placeholder={`${
                !sellerData.deliveryCharges.perKmCharge
                  ? "Per km charge in "
                  : sellerData.deliveryCharges.perKmCharge
              }₹`}
            />
          </p>
        </div>

        <div className="address-card">
          <div className="details">
            <div className="Address-Info">
              <p className="title">Address</p>

              <div className="multi-fields">
                <input
                  disabled={editProfile === "Update"}
                  required
                  name="firstName"
                  onChange={onChangeHandler}
                  value={sellerEditData.firstName}
                  type="text"
                  placeholder={`${
                    !sellerData.address.firstName
                      ? "First name"
                      : sellerData.address.firstName
                  }`}
                />
                <input
                  disabled={editProfile === "Update"}
                  required
                  name="lastName"
                  onChange={onChangeHandler}
                  value={sellerEditData.lastName}
                  type="text"
                  placeholder={`${
                    !sellerData.address.lastName
                      ? "Last name"
                      : sellerData.address.lastName
                  }`}
                />
              </div>

              <input
                required
                disabled={editProfile === "Update"}
                name="addEmail"
                onChange={onChangeHandler}
                value={sellerEditData.addEmail}
                type="email"
                placeholder={
                  !sellerData.address.addEmail
                    ? "Email"
                    : sellerData.address.addEmail
                }
              />

              <input
                required
                disabled={editProfile === "Update"}
                name="street"
                onChange={onChangeHandler}
                value={sellerEditData.street}
                type="text"
                placeholder={
                  !sellerData.address.street
                    ? "Street"
                    : sellerData.address.street
                }
              />

              <div className="multi-fields">
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="city"
                  onChange={onChangeHandler}
                  value={sellerEditData.city}
                  type="text"
                  placeholder={
                    !sellerData.address.city ? "City" : sellerData.address.city
                  }
                />
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="state"
                  onChange={onChangeHandler}
                  value={sellerEditData.state}
                  type="text"
                  placeholder={
                    !sellerData.address.state
                      ? "State"
                      : sellerData.address.state
                  }
                />
              </div>

              <div className="multi-fields">
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="zipcode"
                  onChange={onChangeHandler}
                  value={sellerEditData.zipcode}
                  type="text"
                  placeholder={
                    !sellerData.address.zipcode
                      ? "Zipcode"
                      : sellerData.address.zipcode
                  }
                />
                <input
                  required
                  disabled={editProfile === "Update"}
                  name="country"
                  onChange={onChangeHandler}
                  value={sellerEditData.country}
                  type="text"
                  placeholder={
                    !sellerData.address.country
                      ? "Country"
                      : sellerData.address.country
                  }
                />
              </div>

              <input
                required
                disabled={editProfile === "Update"}
                name="addPhone"
                onChange={onChangeHandler}
                value={sellerEditData.addPhone}
                type="text"
                placeholder={
                  !sellerData.address.addPhone
                    ? "Address Phone no."
                    : sellerData.address.addPhone
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
