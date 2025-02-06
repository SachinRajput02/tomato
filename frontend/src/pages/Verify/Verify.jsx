import React, { useContext, useEffect } from "react";
import "./Verify.css";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../components/context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  // const data = searchParams.get("data");
  // const shopname = searchParams.get("shopname");
  console.log(success);
  console.log(orderId);
  
  

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      
      // const response = await axios.post(`${url}/api/order/verify`, {
      //   success: success,
      //   orderId: orderId,
      //   shopname:shopname,
      //   address:data
      // });

      if (success) {
        // window.location.replace="/myorders"
        // navigate("/myorders");
        window.location.href="/myorders"
      } else {
        window.location.href ="/myorders"
        alert("Payment verification failed. Order was not created.");
      }
        
        
      
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("An error occurred. Please try again.");
      window.location.href="/myorders";
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

 

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
