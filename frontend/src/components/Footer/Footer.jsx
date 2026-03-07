import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          {/* <img src={assets.logo} alt="" /> */}
          
          <h2>Fooddel</h2>
          <p>Stay connected with us! For any inquiries, feel free to contact us or call us. Follow us on social media for the latest updates and exclusive offers. We’re here to assist you 24/7!</p>
          <div className="footer-social-icon" onClick={() => toast.info("Social media not active yet!")}>
              <img src={assets.facebook_icon} alt="" /><img src={assets.linkedin_icon} alt="" /><img src={assets.twitter_icon} alt="" />
          </div>

        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
              <li><Link  to="/">Home</Link></li>
              <li><Link  to="/about">About Us</Link></li>

              <li><Link  to="/cart">Delivery</Link></li>
              <li><Link  to="/privacyPolicy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
              <li>+919636000000</li>
              <li>Contact@Fooddel.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <div>
        
        <p className="footer-copyright">Copyright 2024 © Fooddel.com - All Right Reserved. </p>
        
      </div>
      
    </div>
  )
}

export default Footer
