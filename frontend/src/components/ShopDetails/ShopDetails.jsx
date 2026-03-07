import { useState, useEffect, useContext } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { StoreContext } from '../../components/context/StoreContext';
import './ShopDetails.css';

const ShopDetails = ({ sellerId }) => {
  const { url } = useContext(StoreContext);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!sellerId) return;
      try {
        const response = await fetch(`${url}/api/findShop/getShopById`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sellerId }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch shop details');
        }
        setShop(data);
      } catch (err) {
        console.error("Error fetching shop details", err);
      }
    };

    fetchShopDetails();
  }, [sellerId]);

  return (
    <div className="shop-profile-container">
      <h2 style={{ marginTop: '1rem', marginBottom: '0.8rem' }}>
        
      </h2>
      <hr />
      {shop && (
        <div className="shop-details">
          <img
            src={shop.shopPic}
            alt={shop.shopName}
            className="shop-img"
          />
          <p><strong>Owner:</strong> {shop.address?.firstName} {shop.address?.lastName}</p>
          <p><strong>Phone:</strong> <FaPhoneAlt /> {shop.address?.addPhone}</p>
          <p><strong>Email:</strong> {shop.address?.addEmail}</p>
          <p><strong>Address:</strong> {`${shop.address?.street}, ${shop.address?.city}, ${shop.address?.state} - ${shop.address?.zipcode}`}</p>
        </div>
      )}
    </div>
  );
};

export default ShopDetails;


