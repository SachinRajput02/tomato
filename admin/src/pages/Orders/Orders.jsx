import React from "react";
import "./Orders.css";
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../../../frontend/src/assets/assets";
import { StoreContext } from "../../components/context/StoreContext";
import { onMessage } from "firebase/messaging";
import {messaging} from '../../firebase.js'

const Orders = () => {
  const {
    sellerToken,
    sellerCartItems,
    fetchFoodList,
    food_list,
    removeFromSellerCart,
    url,
  } = useContext(StoreContext);
  // const sellerToken = localStorage.getItem("sellerToken");

  if (sellerToken) {
    console.log("sellertoken hai");
  } else {
    console.log("sellertoken nahi hai");
  }

  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`);

    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error("Error ");
    }
  };

  //my and correct

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);
  useEffect(() => {
    onMessage(messaging, (payload) => {
      toast.info(payload.notification.body);
    });
  }, []);


  return (
    <div className="order add">
      <h3>Order page</h3>
      <div className="order-list">
        {orders
          .filter((order) =>
            order.items.some((item) => sellerCartItems[item._id] > 0)
          )
          .map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (sellerCartItems[item._id] > 0) {
                      if (index === order.items.length - 1) {
                        return item.name + " X " + item.quantity;
                      } else {
                        return item.name + " X " + item.quantity + " , " + " ";
                      }
                    } else {
                      return null;
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      "," +
                      order.address.state +
                      "," +
                      order.address.country +
                      "," +
                      order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items : {order.items.length}</p>
              <p>${order.amount}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Orders;

//   return (
//     <div className="order add">
//       <h3>Order page</h3>
//       <div className="order-list">
//         {orders
//           .filter((order) =>
//             order.items.some((item) => sellerCartItems[item._id] > 0)
//           )
//           .map((order, index) => (
//             <div key={index} className="order-item">
//               <img src={assets.parcel_icon} alt="" />
//               <div>
//                 <p className="order-item-food">
//                   {order.items.map((item, index) => {
//                     if (sellerCartItems[item._id] > 0) {
//                       if (index === order.items.length - 1) {
//                         return item.name + " X " + item.quantity;
//                       } else {
//                         return item.name + " X " + item.quantity + " , " + " ";
//                       }
//                     } else {
//                       return null;
//                     }
//                   })}
//                 </p>
//                 <p className="order-item-name">
//                   {order.address.firstName + " " + order.address.lastName}
//                 </p>
//                 <div className="order-item-address">
//                   <p>{order.address.street + ","}</p>
//                   <p>
//                     {order.address.city +
//                       "," +
//                       order.address.state +
//                       "," +
//                       order.address.country +
//                       "," +
//                       order.address.zipcode}
//                   </p>
//                 </div>
//                 <p className="order-item-phone">{order.address.phone}</p>
//               </div>
//               <p>Items : {order.items.length}</p>
//               <p>${order.amount}</p>
//               <select
//                 onChange={(event) => statusHandler(event, order._id)}
//                 value={order.status}
//               >
//                 <option value="Food Processing">Food Processing</option>
//                 <option value="Out for delivery">Out for delivery</option>
//                 <option value="Delivered">Delivered</option>
//               </select>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;
