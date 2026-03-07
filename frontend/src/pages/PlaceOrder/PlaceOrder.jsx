import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PlaceOrder.css";

import { StoreContext } from "../../components/context/StoreContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const razorpayKey = import.meta.env.RAZORPAY_ID_KEY;
const razorpayKey = import.meta.env.VITE_RAZORPAY_ID_KEY; 

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, userData,
    setUserData,loadUserProfileData } =
    useContext(StoreContext);

  const location = useLocation();
  const { subtotal, deliveryFees, total, groupedCart } = location.state || {};

    const [editAddress, setEditAddress] = useState(true);
    

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
    
    useEffect(() => {
      if (userData?.address) {
        setData({
          firstName: userData.address.firstName || "",
          lastName: userData.address.lastName || "",
          email: userData.address.email || "",
          street: userData.address.street || "",
          city: userData.address.city || "",
          state: userData.address.state || "",
          zipcode: userData.address.zipcode || "",
          country: userData.address.country || "",
          phone: userData.address.phone || "",
        });
      }
    }, [userData]);
    
    const onChangeHandler = (event) => {
      const { name, value } = event.target;
      setData((prev) => ({ ...prev, [name]: value }));
    };
    

  // const [data, setData] = useState({
  //   firstName: userData.address?.firstName || "",
  //   lastName: "",
  //   email: "",
  //   street: "",
  //   city: "",
  //   state: "",
  //   zipcode: "",
  //   country: "",
  //   phone: "",
  // });

  // const onChangeHandler = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   setData((data) => ({ ...data, [name]: value }));
  // };

  const placeOrder = async (event) => {
    event.preventDefault();
    try {
      const orderItemsGroupedByShop = food_list
        .filter((item) => cartItems[item._id] > 0)
        .reduce((group, item) => {
          const shop = item.sellerId ;
          const shopname = item.shopname; 
          if (!group[shop]) {
            group[shop] = [];
          }
          group[shop].push({ ...item, quantity: cartItems[item._id] });
          return group;
        }, {});

      const orders = Object.keys(orderItemsGroupedByShop).map((shop) => ({
        address: data,
        items: orderItemsGroupedByShop[shop],
        shopname: orderItemsGroupedByShop[shop][0].shopname,
        sellerId: orderItemsGroupedByShop[shop][0].sellerId, 
        amount:total
          // orderItemsGroupedByShop[shop].reduce(
          //   (sum, item) => sum + item.price * item.quantity,
          //   0
          // ) + 50, 
      }));

      for (const order of orders) {
        const response = await axios.post(`${url}/api/order/place`, order, {
          headers: { token },
        });

        if (!response.data.success) {
          const { success, shopname, paymentOrderId, orderId, userId,sellerId } =
            response.data;


          const options = {
            key: razorpayKey, 
            amount: orders.amount* 100, 
            currency: "INR",
            order_id: paymentOrderId, // From our backend
            name: "Tomato.com",
            description: "Test Transaction",
            handler: async (response) => {
              
              // The response object from Razorpay
              const {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
              } = response;

              try {
                // Send payment details to the backend for verification
                const verifyResponse = await axios.post(
                  `${url}/api/order/verifyPayment`,
                  {
                    razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature,
                    orderId,
                    userId,
                    sellerId,
                    shopname,
                    address: data,
                  }
                );

                if (verifyResponse.data.success) {
                  alert("Payment verified successfully!");
                  
                  window.location.href = `/verify?success=${verifyResponse.data.success}&orderId=${orderId}`;
                } else {
                  alert("Payment verification failed. Please contact support.");
                }
              } catch (error) {
                console.error("Error verifying payment:", error);
                alert("An error occurred during payment verification.");
              }
            },
            prefill: {
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
              contact: data.phone,
            },
            modal: {
              ondismiss: function () {
                alert("Payment was not completed");
                window.location.href = `/verify?success=false&orderId=${orderId}`;
                
              },
            },
            theme: {
              color: "#F37254",
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();

        
        } else {
          alert("Error placing order. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error placing the order:", error);
      alert("Failed to place the order. Please try again.");
    }


  };
 
   useEffect(() => {
      if (token) {
        loadUserProfileData();
      }
      if(userData.address){
        setEditAddress(false);
      }
    }, [token]);
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);




  return (
    <form onSubmit={placeOrder} className="place-order">
      <p className="title">Delivery Information</p>
      <div className="place-order-left">
        {!editAddress?  
        <div className="Address-available">
        <p><strong>Name:</strong> {userData.address?.firstName} {userData.address?.lastName}</p>
            <p><strong>Email:</strong> {userData.address?.addEmail}</p>
            <p><strong>Address:</strong> {`${userData.address?.street}, ${userData.address?.city}, ${userData.address?.state} - ${userData.address?.zipcode}`}</p>
            <button type="button" onClick={()=>setEditAddress(true)} >Edit Address</button>
          </div>
          :
      <div className="Address-Info">
        
        <div className="multi-fields">
          <input
            required
            name="firstName"   

            value={data.firstName || userData.address?.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName || userData.address?.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email || userData.address?.addEmail}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street || userData.address?.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city || userData.address?.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state || userData.address?.lastName}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode || userData.address?.zipcode}
            type="text"
            placeholder="Pin code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country || userData.address?.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone || userData.address?.phone}
          type="text"
          placeholder="Phone No."
        />
      </div>}
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
               <p>₹{Object.values(deliveryFees).reduce((a, b) => a + b, 0)}</p> 
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                <strong>Total: ₹{total}</strong>
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;



