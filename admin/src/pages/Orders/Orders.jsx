import React, { useState, useContext, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../../../frontend/src/assets/assets";
import { StoreContext } from "../../components/context/StoreContext";
import { io } from "socket.io-client";

const Orders = () => {
  const { sellerToken, sellerCartItems, url } = useContext(StoreContext);
  const socket = io(`${url}`);

  const [orders, setOrders] = useState([]);
  const [chatVisibleFor, setChatVisibleFor] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const userName = "Seller";

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`);
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      fetchAllOrders();
    }
  };

  const sellerOrders = orders.filter((order) =>
    order.items.some((item) => sellerCartItems[item._id] > 0)
  );

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (chatVisibleFor) {
      socket.emit("join-room", chatVisibleFor);

      socket.on("chat-history", (messages) => {
        setChatMessages(messages);
      });

      socket.on("receive-message", (msg) => {
        setChatMessages((prev) => [...prev, msg]);

        if (chatVisibleFor !== msg.orderId) {
          toast.info(`New message from ${msg.sender}: ${msg.text}`);
        }
      });

      return () => {
        socket.off("chat-history");
        socket.off("receive-message");
      };
    }
  }, [chatVisibleFor]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMsg = {
        sender: userName,
        text: message,
        timestamp: new Date(),
      };

      socket.emit("send-message", {
        orderId: chatVisibleFor,
        sender: newMsg.sender,
        text: newMsg.text,
      });

      setMessage("");
    }
  };

  return (
    <div className="order add">
      {/* <h2 className="order-title">📦 Orders Dashboard</h2> */}
      <div className="order-list">
        {sellerOrders.length > 0 ? (
          sellerOrders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, i) =>
                    sellerCartItems[item._id] > 0
                      ? `${item.name} x${item.quantity}${i !== order.items.length - 1 ? ", " : ""}`
                      : null
                  )}
                </p>
                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">📞 {order.address.phone}</p>
              </div>

              <div className="order-status">
                <p>Items: {order.items.length}</p>
                <p>💰 ₹{order.amount}</p>

                <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>

                <button
                  className="chat-toggle"
                  onClick={() => {
                    setChatVisibleFor(chatVisibleFor === order._id ? null : order._id);
                    setChatMessages([]);
                  }}
                >
                  {chatVisibleFor === order._id ? "Hide Chat" : "💬 Message"}
                </button>
              </div>

              {chatVisibleFor === order._id && (
                <div className="chat-box">
                  <div className="messages">
                    {chatMessages.map((msg, i) => {
                      const time = new Date(msg.timestamp);
                      const hours = time.getHours().toString().padStart(2, "0");
                      const minutes = time.getMinutes().toString().padStart(2, "0");
                      return (
                        <div
                          key={i}
                          className={`message ${msg.sender === userName ? "right" : "left"}`}
                        >
                          <strong>{msg.sender}</strong>: {msg.text}
                          <div className="timestamp">{hours}:{minutes}</div>
                        </div>
                      );
                    })}
                  </div>
                  <form onSubmit={handleSendMessage}>
                    <input
                      placeholder="Type message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                    <button type="submit">Send</button>
                  </form>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-orders">
            <img src={assets.parcel_icon} alt="No Orders" />
            <p>No orders available for your items yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;






// import React, { useState, useContext, useEffect } from "react";
// import "./Orders.css";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { assets } from "../../../../frontend/src/assets/assets";
// import { StoreContext } from "../../components/context/StoreContext";
// import { io } from "socket.io-client";


// const Orders = () => {
//   const {
//     sellerToken,
//     sellerCartItems,
//     url,
//   } = useContext(StoreContext);
//   const socket = io(`${url}`);

//   const [orders, setOrders] = useState([]);
//   const [chatVisibleFor, setChatVisibleFor] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const userName = "Seller";

//   const fetchAllOrders = async () => {
//     const response = await axios.get(`${url}/api/order/list`);
//     if (response.data.success) {
//       setOrders(response.data.data);
//     } else {
//       toast.error("Error fetching orders");
//     }
//   };

//   const statusHandler = async (event, orderId) => {
//     const response = await axios.post(`${url}/api/order/status`, {
//       orderId,
//       status: event.target.value,
//     });
//     if (response.data.success) {
//       fetchAllOrders();
//     }
//   };

//   const sellerOrders = orders.filter((order) =>
//     order.items.some((item) => sellerCartItems[item._id] > 0)
//   );

//   useEffect(() => {
//     fetchAllOrders();
//   }, []);


//   useEffect(() => {
//     if (chatVisibleFor) {
//       socket.emit("join-room", chatVisibleFor);
  
//       socket.on("chat-history", (messages) => {
//         setChatMessages(messages);
//       });
  
//       socket.on("receive-message", (msg) => {
//         setChatMessages((prev) => [...prev, msg]);
  
//         // ✅ If chat is hidden, show notification
//         if (chatVisibleFor !== msg.orderId) {
//           toast.info(`New message from ${msg.sender}: ${msg.text}`);
//         }
//       });
  
//       return () => {
//         socket.off("chat-history");
//         socket.off("receive-message");
//       };
//     }
//   }, [chatVisibleFor]);
  



//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       const newMsg = {
//         sender: userName,
//         text: message,
//         timestamp: new Date()
//       };

//       socket.emit("send-message", {
//         orderId: chatVisibleFor,
//         sender: newMsg.sender,
//         text: newMsg.text
//       });

//       // setChatMessages((prev) => [...prev, newMsg]);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="order add">
//       <div className="order-list">
//         {sellerOrders.length > 0 ? (
//           sellerOrders.map((order, index) => (
//             <div key={index} className="order-item">
//               <img src={assets.parcel_icon} alt="" />
//               <div>
//                 <p className="order-item-food">
//                   {order.items.map((item, i) =>
//                     sellerCartItems[item._id] > 0
//                       ? `${item.name} x${item.quantity}${i !== order.items.length - 1 ? ", " : ""}`
//                       : null
//                   )}
//                 </p>
//                 <p className="order-item-name">
//                   {order.address.firstName} {order.address.lastName}
//                 </p>
//                 <div className="order-item-address">
//                   <p>{order.address.street},</p>
//                   <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
//                 </div>
//                 <p className="order-item-phone">{order.address.phone}</p>
//               </div>

//               <p>Items : {order.items.length}</p>
//               <p>₹{order.amount}</p>

//               <select
//                 onChange={(event) => statusHandler(event, order._id)}
//                 value={order.status}
//               >
//                 <option value="Food Processing">Food Processing</option>
//                 <option value="Out for delivery">Out for delivery</option>
//                 <option value="Delivered">Delivered</option>
//               </select>

//               <button
//                 onClick={() => {
//                   setChatVisibleFor(chatVisibleFor === order._id ? null : order._id);
//                   setChatMessages([]);
//                 }}
//               >
//                 {chatVisibleFor === order._id ? "Hide Chat" : "Message"}
//               </button>

//               {chatVisibleFor === order._id && (
//                 <div className="chat-box">
//                   <div className="messages">
//                     {chatMessages.map((msg, i) => {
//                       const time = new Date(msg.timestamp);
//                       const hours = time.getHours().toString().padStart(2, "0");
//                       const minutes = time.getMinutes().toString().padStart(2, "0");
//                       return (
//                         <div
//                           key={i}
//                           className={`message ${msg.sender === userName ? "right" : "left"}`}
//                         >
//                           <strong>{msg.sender}</strong>: {msg.text}
//                           <div className="timestamp">{hours}:{minutes}</div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <form onSubmit={handleSendMessage}>
//                     <input
//                       placeholder="Type message"
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                       required
//                     />
//                     <button type="submit">Send</button>
//                   </form>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="no-orders">
//             <img src={assets.parcel_icon} alt="No Orders" />
//             <p>No orders available for your items yet.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Orders;






