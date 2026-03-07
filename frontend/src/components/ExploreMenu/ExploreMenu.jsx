import React, { useRef } from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
import { FaArrowRight } from 'react-icons/fa'

const ExploreMenu = ({ category, setCategory }) => {
  const scrollRef = useRef();

    const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore Our Menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes.
        
      </p>
      {/* <div className="scroll-indicator-left" onClick={scrollLeft}>
          <FaArrowRight size={18} />
        </div> */}
      {/* <div className="scroll-indicator-right" onClick={scrollRight}>
          <FaArrowRight size={18} />
        </div> */}

      <div className="explore-menu-list" ref={scrollRef}>
      
        {
          menu_list.map((item, index) => (
            <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} key={index} className="explore-menu-list-item">
              <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt="" />
              <p>{item.menu_name}</p>
            </div>
          ))
        }
      </div>

      <hr />
    </div>
  )
}

export default ExploreMenu;


// import React from 'react'
// import './ExploreMenu.css'
// import {menu_list} from '../../assets/assets'

// const ExploreMenu = ({category,setCategory}) => {
//   return (
//     <div className='explore-menu' id='explore-menu'>
//         <h1>Explore Our Menu</h1>
//         <p className='explore-menu-text'>choose from a diverse menu featuring a delectable arry of dishes .our mission is to satisfy your cravings and elevate your dining experience , one delicious meal at a time</p>
//         <div className="explore-menu-list">
//             {
//                 menu_list.map((item,index)=>{
//                     return(
//                         <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index}  className="explore-menu-list-item">
//                             <img className={ category===item.menu_name?"active":""} src={item.menu_image} alt="" />
//                             <p>{item.menu_name}</p>
//                         </div>
//                     )
//                 })
//             }
//         </div>
//         <hr />
//     </div>
    
//   )
// }

// export default ExploreMenu
