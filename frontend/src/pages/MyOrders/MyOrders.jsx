import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../components/context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(
      `${url}/api/order/userorders`,
      {},
      { headers: { token } }
    );
    setData(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);


  

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
      {data.length === 0 ? (
  <div className="no-orders">
    <img src={assets.parcel_icon} alt="No Orders" />
    <h3>No Orders Yet!</h3>
    <p>Looks like you haven't placed any orders. Start shopping now!</p>
    <button onClick={() => window.location.href = "/"}>Shop Now</button>
  </div>
) : (
  data.map((order, index) => (
    <div key={index} className="my-orders-order">
      <img src={assets.parcel_icon} alt="" />
      <p>{order.items.map((item, index) => (
        index === order.items.length - 1 ? item.name + "X" + item.quantity : item.name + "X" + item.quantity + ", "
      ))}</p>
      <p>₹{order.amount}.00</p>
      <p>Items: {order.items.length}</p>
      <p><span>&#x25cf;</span><b>{order.status}</b></p>
      <button onClick={() => {
        if (!order.payment) {
          alert("Payment is still pending for this order.");
        } else {
          console.log("Tracking order:", order);
        }
      }}>
        {order.payment ? "Track Order" : "Payment Pending"}
      </button>
    </div>
  ))
)}

        {/* {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>{order.items.map((item,index) => {
                if(index === order.items.length-1){
                    return item.name+"X"+item.quantity
                }
                else{
                    return item.name+"X"+item.quantity + ","+" "
                }
              })}</p>
              <p>₹{order.amount}.00</p>
              <p>Items:{order.items.length}</p>
              <p><span>&#x25cf;</span><b>{order.status}</b></p>
              <button onClick={() => {
                if (!order.payment) {
                  alert("Payment is still pending for this order.");
                } else {
                  // Add your "Track Order" logic here
                  console.log("Tracking order:", order);
                }
              }}
            >
              {order.payment ? "Track Order" : "Payment Pending"}</button>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default MyOrders;
