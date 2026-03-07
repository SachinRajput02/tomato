import React,{useState} from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home/Home";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Seller from "./pages/Profile/Profile";
import SellerLoginPopup from "./components/SellerLoginPopup/SellerLoginPopup";
import BottomBar from "./components/BottomBar/BottomBar";


const App = () => {
  const [showSellerLogin, setShowSellerLogin] = useState();

  return (
    <>
      {showSellerLogin ? (
        <SellerLoginPopup setShowSellerLogin={setShowSellerLogin} />
      ) : (
        <></>
      )}

      <div>
        <ToastContainer />
        <Navbar setShowSellerLogin={setShowSellerLogin}  />
        <hr />
        <div className="app-content">
          <Sidebar />
          <Routes>
            <Route path="/"  element={<Home  setShowSellerLogin={setShowSellerLogin}/>} />
            <Route path="/sellerProfile" element={<Seller />}/>
            <Route path="/add" element={<Add  />} />
            <Route path="/List" element={<List  />} />
            <Route path="/Orders" element={<Orders  />} />
          </Routes>
        </div>
      </div>
      <BottomBar />
    </>
  );
};

export default App;
