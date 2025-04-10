import { useState } from 'react';
import styles from './Auth.module.css';
import { auth } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const Auth = ({ setPage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert('🎉 Logged in successfully!');
        setPage('home');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('🎉 Account created successfully!');
        setPage('home');
      }
    } catch (err) {
      alert('❌ ' + err.message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert('🎉 Logged in with Google!');
      setPage('home');
    } catch (err) {
      alert('❌ ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <h2>{isLogin ? 'Welcome Back 👋' : 'Create an Account 📝'}</h2>
      <form className={styles.authForm} onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Continue with Google'}
        </button>

        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
