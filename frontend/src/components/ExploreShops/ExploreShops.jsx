import React from 'react'
import './ExploreShops.css'
import {shop_list} from '../../assets/assets'

const ExploreShops = ({category,setCategory}) => {
  return (
    <div className='explore-shop' id='explore-shop'>
        <h2>Your Shops</h2>
        <p className='explore-shop-text'>Choose Your Shops and gets the shop of your nearby-choosen shops and order the food from your shop</p>
        <div className="explore-shop-list">
            {
                shop_list.map((item,index)=>{
                    return(
                        <div onClick={()=>setShop(prev=>prev===item.shop_name?"All":item.shop_name)} key={index}  className="explore-shop-list-item">
                            <img className={ category===item.shop_name?"active":""} src={item.shop_image} alt="" />
                            <p>{item.shop_name}</p>
                        </div>
                    )
                })
            }
        </div>
        <hr />
    </div>
    
  )
}

export default ExploreShops
