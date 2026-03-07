import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./MyOrders.css";
import { StoreContext } from "../../components/context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { io } from "socket.io-client";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [chatVisibleFor, setChatVisibleFor] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("User");
  const socket = io(`${url}`);

  //message
  // const [modalVisible, setModalVisible] = useState(false);
  const [chatBoxVisible, setChatBoxVisible] = useState(false);

  //reviews
  const [reviewVisibleFor, setReviewVisibleFor] = useState(null);
  const [reviewAreaVisible, setReviewAreaVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchOrders = async () => {
    const response = await axios.post(
      `${url}/api/order/userorders`,
      {},
      { headers: { token } }
    );
    setData(response.data.data);
  };

  const openReviewModal = (Id, targetType) => {
    setReviewTarget({ targetType: targetType, targetId: Id });
    setReviewModalVisible(true);
    setRating(5);
    setComment("");
  };

  const submitReview = async () => {
    try {
      await axios.post(
        `${url}/api/review/createReview`,
        {
          targetType: reviewTarget.targetType,
          targetId: reviewTarget.targetId,
          rating,
          comment,
        },
        { headers: { token } }
      );
      // toast("Review submitted successfully!");
      toast.success("Review submitted successfully!");
      setReviewModalVisible(false);
    } catch (err) {
      console.error("Review submission error:", err);
      // toast(err.response?.data?.message || "Failed to submit review");
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  useEffect(() => {
    if (chatVisibleFor) {
      socket.emit("join-room", chatVisibleFor);

      socket.on("chat-history", (messages) => {
        setChatMessages(messages);
      });

      socket.on("receive-message", (msg) => {
        setChatMessages((prev) => [...prev, msg]);

        //  If chat is hidden, show notification
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
      };

      socket.emit("send-message", {
        orderId: chatVisibleFor,
        sender: newMsg.sender,
        text: newMsg.text,
      });

      setMessage("");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <div className="no-orders">
            <img src={assets.parcel_icon} alt="No Orders" />
            <h3>No Orders Yet!</h3>
            <p>Looks like you haven't placed any orders. Start shopping now!</p>
            <button onClick={() => (window.location.href = "/")}>
              Shop Now
            </button>
          </div>
        ) : (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              {/* <img src={assets.parcel_icon} alt="" /> */}
              <div className="food-images-order-header">
                {order.items.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image}
                    alt={item.name}
                    onError={(e) => (e.target.src = assets.default_food_image)}
                  />
                ))}
              </div>

              <p>{order.shopname}</p>
              <p>
                {order.items.map((item, idx) =>
                  idx === order.items.length - 1
                    ? item.name + " x" + item.quantity
                    : item.name + " x" + item.quantity + ", "
                )}
              </p>
              <p>₹{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span>
                <b>{order.status}</b>
              </p>
              <button
                onClick={() => {
                  if (!order.payment) {
                    alert("Payment is still pending for this order.");
                  } else {
                    console.log("Tracking order:", order);
                  }
                }}
              >
                {order.payment ? "Track Order" : "Payment Pending"}
              </button>
              <button
                onClick={() => {
                  setChatVisibleFor(
                    chatVisibleFor === order._id ? null : order._id
                  );
                  setChatMessages([]);
                  setChatBoxVisible(
                    chatVisibleFor !== order._id ? true : !chatBoxVisible
                  );
                }}
              >
                {chatVisibleFor === order._id ? "Hide Chat" : "Chat"}
              </button>
              <button onClick={() => {
                setReviewAreaVisible(reviewAreaVisible !== order._id ? true : !reviewAreaVisible);
                setReviewVisibleFor(reviewVisibleFor === order._id ? null : order._id);
              }}>
                {reviewVisibleFor === order._id ? "hide reviews" : "write reviews"}
              </button>

              {chatBoxVisible && chatVisibleFor === order._id && (
                <div className="chat-box ">
                  <div className="messages ">
                    {chatMessages.map((msg, i) => {
                      const time = new Date(msg.timestamp);
                      const hours = time.getHours().toString().padStart(2, "0");
                      const minutes = time
                        .getMinutes()
                        .toString()
                        .padStart(2, "0");
                      return (
                        <div
                          key={i}
                          className={`message  ${
                            msg.sender === userName ? "right" : "left"
                          }`}
                        >
                          <strong>{msg.sender}</strong>: {msg.text}
                          <div className="timestamp">
                            {hours}:{minutes}
                          </div>
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
                    {/* <button onClick={() => setChatBoxVisible(false)}>
                      Hide
                    </button> */}
                  </form>
                </div>
              )}
              
              {reviewAreaVisible && reviewVisibleFor === order._id && (
                <div className="review-Container">
                  <div className="food-review-div">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="food-review-item">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) =>
                            (e.target.src = assets.default_food_image)
                          }
                        />
                        <button
                          onClick={() => openReviewModal(item._id, "Food")}
                        >
                          {`for ${item.name}`}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="seller-review-div">
                    {order.sellerId ? (
                      <div className="seller-review-item">
                        <button
                          onClick={() =>
                            openReviewModal(order.sellerId, "Seller")
                          }
                        >
                          Write a Review for <p>{order.shopname}</p>
                        </button>
                      </div>
                    ) : (
                      <div className="no-seller-review">
                        <p>No Available.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Review Modal */}

              {reviewModalVisible && (
                <div className="modal-backdrop">
                  <div className="review-modal">
                    <h3>Write a Review</h3>
                    <label>
                      Rating:
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Comment:
                      <textarea
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </label>
                    <button onClick={submitReview}>Submit Review</button>
                    <button onClick={() => setReviewModalVisible(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
