import React, { useEffect, useState,useContext } from 'react';
import "./ChatBox.css"
import { io } from 'socket.io-client';
import { StoreContext } from "../../components/context/StoreContext";


const ChatBox = ({ orderId, sender }) => {
  const { url, token } = useContext(StoreContext);
  const socket = io(`${url}`);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit('join-room', orderId);

    socket.on('chat-history', (messages) => {
      setChat(messages);
    });

    socket.on('receive-message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [orderId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send-message', { orderId, sender, text: message });
      setChat((prev) => [...prev, { sender, text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {chat.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === sender ? 'right' : 'left'}`}>
            <strong>{msg.sender}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input placeholder='type message' value={message} onChange={(e) => setMessage(e.target.value)} required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
