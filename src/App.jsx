import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Write from './pages/Write';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './reset.module.css';

const App = () => {
  const [page, setPage] = useState('auth');
  const [user, setUser] = useState(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        if (page === 'auth') setPage('home');
      } else {
        setUser(null);
        setPage('auth');
      }
    });
    return () => unsubscribe();
  }, []);

  const renderPage = () => {
    if (!user) return <Auth setPage={setPage} />;
    switch (page) {
      case 'home': return <Home setPage={setPage} />;
      case 'write': return <Write setPage={setPage} />;
      case 'profile': return <Profile setPage={setPage} />;
      case 'community': return <Community setPage={setPage} />;
      case 'settings': return <Settings setPage={setPage} />;
      default: return <Home setPage={setPage} />;
    }
  };

  return (
    <div>
      {user && <Navigation setPage={setPage} currentPage={page} />}
      <div>{renderPage()}</div>
    </div>
  );
};

export default App;
