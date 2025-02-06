import React,{useContext,useEffect,useState} from 'react'
import { useNavigate  } from 'react-router-dom'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../context/StoreContext'
const Navbar = ({setShowSellerLogin}) => {

  const{sellerToken,setSellerToken,fetchShopName,setSellerCartItems}=useContext(StoreContext);

    // const {
    //   fetchShopName 
    // } = useContext(StoreContext);
    const [shopName, setShopName] = useState('');
    
    useEffect(() => {
      // Fetch the shop name and update the state
      const getShopName = async () => {
        const name = await fetchShopName(); // Assuming fetchShopName returns a Promise
        setShopName(name);
      };
  
      getShopName();
    }, [sellerToken,fetchShopName]);

    const navigate = useNavigate();
    const logout = () =>{
      localStorage.removeItem("sellerToken");
      setSellerToken("");
      setSellerCartItems({}); // Clear cart items dynamically
    setShopName(""); 
      navigate("/");
    }
    
  

    
  return (

    
    <div className='navbar'>
      
      <h3 className='shop_name'>{shopName||<img className='logo' src={assets.logo}></img>}</h3>
      
        <img className='shop_image' src={assets.shop_image} alt="" />
      
      
      {!sellerToken? <div className="navbar-sign-in">
                <button onClick={()=>setShowSellerLogin(true)}>Sign in</button>
                
              </div>
              :(
                        <div className="navbar-profile">
                          <img src={assets.profile_icon} alt="" />
                          <ul className="navbar-profile-dropdown">
                          <li onClick={() => navigate("/sellerProfile")}>
                              <img src={assets.user_icon} alt="" />
                              <p>Profile</p>
                            </li>
                            
                            <hr />
                            <li onClick={logout}>
                              <img src={assets.logout_icon} alt="" />
                              <p>Logout</p>
                            </li>
                          </ul>
                        </div>
                      )
              
              // <div className='navbar-profile'>
              //   <img src={assets.profile_icon} alt="" />
              //   <ul className="navbar-profile-dropdown">
                  
              //     <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
              //   </ul>
              //   </div>
                
                } 
    </div>
  )
}

export default Navbar
