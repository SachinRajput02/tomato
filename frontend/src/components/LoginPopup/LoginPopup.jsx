import React, { useContext, useState ,useEffect} from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import Spinner from "../Spinner/Spinner";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin }) => {
  const { url,fetchFoodList,loadCartData, setToken } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign-Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });



  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  
  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    setLoading(true);
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    const response = await axios.post(newUrl, data);
    
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      await loadCartData(localStorage.getItem("token"));
      setShowLogin(false);
      // setLoading(false);
    } else {
      alert(response.data.message);
    }
    setLoading(false);
    
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          {loading && <Spinner />}
          
          <img
            onClick={() => {
              setShowLogin(false);
            }}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="your name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="your E-mail"
            required
          />
          {/* {currState === "Login" ? (
            <></>
          ) : ( 
          <input
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            type="phone"
            placeholder="your phone no."
            required
          />)} */}
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password
          "
            placeholder="password
          "
            required
          />
        </div>
        <button type="submit">
          {currState === "Sign-Up" ? "Create account" : "Login"}
        </button>
        {currState === "Login" ?(
          <></>
        ): (
          
          <div className="login-popup-condition">
          <input type="checkbox" name="" id="" required />
          <p>
            I agree to the <span onClick={() => {navigate("/privacyPolicy");setShowLogin(false);}}>Privacy Policy</span>
          </p>
        </div>)}
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign-Up")}>Click here</span>{" "}
          </p>
        ) : (
          <p>
            Already have an account ?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
