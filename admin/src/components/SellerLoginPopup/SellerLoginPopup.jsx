import React, { useState, useContext } from 'react';
import './SellerLoginPopup.css';
import Spinner from "../Spinner/Spinner";
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import { assets } from '../../../../frontend/src/assets/assets';
import { useNavigate } from 'react-router-dom';
import { requestFCMToken } from '../../firebase.js';



const SellerLoginPopup = ({ setShowSellerLogin }) => {
  
  const navigate = useNavigate(); 

  const { url,sellerToken, setSellerToken } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [currState, setCurrState] = useState('Sign-Up');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    fcmToken:'',
    
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const fcmToken = await requestFCMToken();
    const requestData = { ...data, fcmToken };
    console.log(fcmToken);
    setLoading(true);
    let endpoint = url + (currState === 'Login' ? '/api/seller/login' : '/api/seller/register');
    const response = await axios.post(endpoint, requestData);

    if (response.data.success) {
      setSellerToken(response.data.sellerToken);
      localStorage.setItem("sellerToken", response.data.sellerToken); 
      console.log(localStorage.getItem("sellerToken"));
      setShowSellerLogin(false);
      const sellerToken = localStorage.getItem("sellerToken")
      if (!sellerToken) {
        alert("Please login first.");
        window.location.href = '/login';
      }
      
    } else {  
      alert(response.data.message);
    }
    setLoading(false);
  };



  return (
    <div className="login-popup">
      <form onSubmit={onSubmitHandler} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          {loading && <Spinner />}
         
          <img onClick={() => setShowSellerLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="login-popup-inputs">
          {currState === 'Sign-Up' && (
            <>
              {/* <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your Name" required /> */}
              <input name="shopName" onChange={onChangeHandler} value={data.shopName} type="text" placeholder="Shop Name" required />
            </>
          )}


          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="E-mail" required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required />
        </div>
        <button type="submit">{currState === 'Sign-Up' ? 'Create Shop' : 'Login'}</button>
        {currState === 'Login' ? (
          <p>No shop? <span onClick={() => setCurrState('Sign-Up')}>Register here</span></p>
        ) : (
          <p>Already have a shop? <span onClick={() => setCurrState('Login')}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default SellerLoginPopup;
