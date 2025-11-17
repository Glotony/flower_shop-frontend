import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../css/navbar.module.css'; // optional CSS module

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // handle logout logic here
    console.log('Logged out');
    navigate('/login'); // redirect to login page after logout
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        🌸 Flower Shop
      </div>
      <div className={styles.links}>
        {location.pathname !== '/products' && (
          <button className={styles.navButton} onClick={() => navigate('/products')}>
            Products
          </button>
        )}
        <button className={styles.navButton} onClick={() => navigate('/cart')}>
          Cart
        </button>
        <button className={styles.navButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
