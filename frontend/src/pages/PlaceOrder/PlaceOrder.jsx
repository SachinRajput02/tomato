import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";

import { StoreContext } from "../../components/context/StoreContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const razorpayKey = import.meta.env.RAZORPAY_ID_KEY;

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

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

  const placeOrder = async (event) => {
    event.preventDefault();
    try {
      const orderItemsGroupedByShop = food_list
        .filter((item) => cartItems[item._id] > 0)
        .reduce((group, item) => {
          const shop = item.shopname; // Assuming `shopname` is a property in `item`
          if (!group[shop]) {
            group[shop] = [];
          }
          group[shop].push({ ...item, quantity: cartItems[item._id] });
          return group;
        }, {});

      const orders = Object.keys(orderItemsGroupedByShop).map((shop) => ({
        address: data,
        items: orderItemsGroupedByShop[shop],
        shopname: shop, // Include shopname for backend reference
        amount:
          orderItemsGroupedByShop[shop].reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ) + 50, // Add delivery fee
      }));

      for (const order of orders) {
        const response = await axios.post(`${url}/api/order/place`, order, {
          headers: { token },
        });

        if (!response.data.success) {
          const { success, shopname, paymentOrderId, orderId, userId } =
            response.data;

          //gpt code
          const options = {
            key: razorpayKey, // Replace with your Razorpay key
            amount: orders.amount * 100, // Amount in paise
            currency: "INR",
            order_id: paymentOrderId, // From your backend
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
                    shopname,
                    address: data, // Your custom order ID from the backend
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

  // useEffect(() => {
  //   // const { getTotalCartAmount, token, } =
  //   // useContext(StoreContext);
  //   if (!token) {
  //     window.location.href="/";
  //   } else if (getTotalCartAmount() === 0) {
  //     window.location.href="/";
  //   }
  // }, [token]);

  // chatgpt written code end here

  return (
    <form onSubmit={placeOrder} className="place-order">
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
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 50)}
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






//correct code here

// import React, { useContext, useEffect, useState } from "react";
// import "./PlaceOrder.css";

// import { StoreContext } from "../../components/context/StoreContext.jsx";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const razorpayKey = import.meta.env.RAZORPAY_ID_KEY;

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const { getTotalCartAmount, token, food_list, cartItems, url } =
//     useContext(StoreContext);

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//   });

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData((data) => ({ ...data, [name]: value }));
//   };

//   const placeOrder = async (event) => {
//     event.preventDefault();
//     try {
//       const orderItemsGroupedByShop = food_list
//         .filter((item) => cartItems[item._id] > 0)
//         .reduce((group, item) => {
//           const shop = item.shopname; // Assuming `shopname` is a property in `item`
//           if (!group[shop]) {
//             group[shop] = [];
//           }
//           group[shop].push({ ...item, quantity: cartItems[item._id] });
//           return group;
//         }, {});

//       const orders = Object.keys(orderItemsGroupedByShop).map((shop) => ({
//         address: data,
//         items: orderItemsGroupedByShop[shop],
//         shopname: shop, // Include shopname for backend reference
//         amount:
//           orderItemsGroupedByShop[shop].reduce(
//             (sum, item) => sum + item.price * item.quantity,
//             0
//           ) + 50, // Add delivery fee
//       }));

//       for (const order of orders) {
//         const response = await axios.post(`${url}/api/order/place`, order, {
//           headers: { token },
//         });

//         if (!response.data.success) {
//           const { success, shopname, paymentOrderId, orderId, userId } =
//             response.data;

//           //gpt code
//           const options = {
//             key: razorpayKey, // Replace with your Razorpay key
//             amount: orders.amount * 100, // Amount in paise
//             currency: "INR",
//             order_id: paymentOrderId, // From your backend
//             name: "Your Company Name",
//             description: "Test Transaction",
//             handler: async (response) => {
              
//               // The response object from Razorpay
//               const {
//                 razorpay_payment_id,
//                 razorpay_order_id,
//                 razorpay_signature,
//               } = response;

//               try {
//                 // Send payment details to the backend for verification
//                 const verifyResponse = await axios.post(
//                   `${url}/api/order/verifyPayment`,
//                   {
//                     razorpay_payment_id,
//                     razorpay_order_id,
//                     razorpay_signature,
//                     orderId,
//                     userId,
//                     shopname,
//                     address: data, // Your custom order ID from the backend
//                   }
//                 );

//                 if (verifyResponse.data.success) {
//                   alert("Payment verified successfully!");
                  
//                   window.location.href = `/verify?success=${verifyResponse.data.success}&orderId=${orderId}`;
//                 } else {
//                   alert("Payment verification failed. Please contact support.");
//                 }
//               } catch (error) {
//                 console.error("Error verifying payment:", error);
//                 alert("An error occurred during payment verification.");
//               }
//             },
//             prefill: {
//               name: `${data.firstName} ${data.lastName}`,
//               email: data.email,
//               contact: data.phone,
//             },
//             modal: {
//               ondismiss: function () {
//                 alert("Payment was not completed");
//                 window.location.href = `/verify?success=false&orderId=${orderId}`;
                
//               },
//             },
//             theme: {
//               color: "#F37254",
//             },
//           };

//           const razorpay = new window.Razorpay(options);
//           razorpay.open();

        
//         } else {
//           alert("Error placing order. Please try again.");
//         }
//       }
//     } catch (error) {
//       console.error("Error placing the order:", error);
//       alert("Failed to place the order. Please try again.");
//     }


//   };

//   // useEffect(() => {
//   //   // const { getTotalCartAmount, token, } =
//   //   // useContext(StoreContext);
//   //   if (!token) {
//   //     window.location.href="/";
//   //   } else if (getTotalCartAmount() === 0) {
//   //     window.location.href="/";
//   //   }
//   // }, [token]);

//   // chatgpt written code end here

//   return (
//     <form onSubmit={placeOrder} className="place-order">
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="multi-fields">
//           <input
//             required
//             name="firstName"
//             onChange={onChangeHandler}
//             value={data.firstName}
//             type="text"
//             placeholder="First name"
//           />
//           <input
//             required
//             name="lastName"
//             onChange={onChangeHandler}
//             value={data.lastName}
//             type="text"
//             placeholder="Last name"
//           />
//         </div>
//         <input
//           required
//           name="email"
//           onChange={onChangeHandler}
//           value={data.email}
//           type="email"
//           placeholder="Email address"
//         />
//         <input
//           required
//           name="street"
//           onChange={onChangeHandler}
//           value={data.street}
//           type="text"
//           placeholder="Street"
//         />
//         <div className="multi-fields">
//           <input
//             required
//             name="city"
//             onChange={onChangeHandler}
//             value={data.city}
//             type="text"
//             placeholder="City"
//           />
//           <input
//             required
//             name="state"
//             onChange={onChangeHandler}
//             value={data.state}
//             type="text"
//             placeholder="State"
//           />
//         </div>
//         <div className="multi-fields">
//           <input
//             required
//             name="zipcode"
//             onChange={onChangeHandler}
//             value={data.zipcode}
//             type="text"
//             placeholder="Pin code"
//           />
//           <input
//             required
//             name="country"
//             onChange={onChangeHandler}
//             value={data.country}
//             type="text"
//             placeholder="Country"
//           />
//         </div>
//         <input
//           required
//           name="phone"
//           onChange={onChangeHandler}
//           value={data.phone}
//           type="text"
//           placeholder="Phone No."
//         />
//       </div>
//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>₹{getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>
//                 ₹{getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 50)}
//               </b>
//             </div>
//           </div>
//           <button type="submit">PROCEED TO PAYMENT</button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;
