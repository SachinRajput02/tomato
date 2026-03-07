import React,{useContext} from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'


const Sidebar = () => {
  const{getTotalSellerCartAmount,getTotalSellerCartQuantity,token,setToken}=useContext(StoreContext);
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/' className="sidebar-option">
          <img src={assets.home_icon} alt="" />
          <p>Home</p>
        </NavLink>
      <NavLink to='/Orders' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to='/List' className="sidebar-option">
          <img src={assets.list_items} alt="" />
          <p>List Items</p>
          {/* <div  className={getTotalSellerCartQuantity()===0?"":"dot"}>{getTotalSellerCartQuantity()===0?'':getTotalSellerCartQuantity()}</div> */}
        </NavLink>
        <NavLink to='/analytics' className="sidebar-option analytics">
          <img src={assets.analytics} alt="" />
          <p>analytics</p>
        </NavLink>
        
      </div>
    </div>
  )
}

export default Sidebar
