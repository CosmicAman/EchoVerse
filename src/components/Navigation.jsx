import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Navigation = ({ setPage, currentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleNavClick = (page) => {
    setPage(page);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPage('auth');
    } catch (err) {
      alert('❌ Logout failed: ' + err.message);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>EchoVerse</div>

      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.show : ''}`}>
        {['home', 'write', 'community', 'profile', 'settings'].map((item) => (
          <button
            key={item}
            onClick={() => handleNavClick(item)}
            className={currentPage === item ? styles.active : ''}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>

        {user && (
          <div className={styles.userBox}>
            <img
              src={user.photoURL || '/default-avatar.png'}
              alt="User Avatar"
              className={styles.avatar}
            />
            <span className={styles.username}>
              {user.displayName || user.email.split('@')[0]}
            </span>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
