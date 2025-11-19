import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../css/navbar.module.css';

export default function Navbar({ token }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // redirect to login
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        🌸 Flower Shop
      </div>
      <div className={styles.links}>
        {location.pathname !== '/' && (
          <button className={styles.navButton} onClick={() => navigate('/')}>
            Products
          </button>
        )}

        {location.pathname !== '/cart' && token && (
          <button className={styles.navButton} onClick={() => navigate('/cart')}>
            Cart
          </button>
        )}

        {/* Phase 1: Logout visible only on products page */}
        {token && location.pathname === '/' && (
          <button className={styles.navButton} onClick={handleLogout}>
            Logout
          </button>
        )}

        {/* Future phase: show logout on profile page */}
        {token && location.pathname === '/profile' && (
          <button className={styles.navButton} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
