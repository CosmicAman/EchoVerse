import { useState } from 'react';
import styles from './Auth.module.css';
import { auth } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

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
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('🎉 Account created successfully!');
      }
      setPage('home');
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
    <motion.div
      className={styles.authContainer}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.authCard}>
        <div className={styles.formSection}>
          <h2 className={styles.heading}>
            {isLogin ? 'Welcome Back 👋' : 'Join the EchoVerse 🌌'}
          </h2>
          <form className={styles.authForm} onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles.authBtn} type="submit" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
            </button>

            <div className={styles.separator}>or</div>

            <button
              type="button"
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <FcGoogle size={20} style={{ marginRight: '8px' }} />
              {loading ? 'Authenticating...' : 'Sign in with Google'}
            </button>

            <p className={styles.toggleText}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </form>
        </div>

        <motion.div
          className={styles.aboutCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3>✨ About EchoVerse</h3>
          <p>
            EchoVerse is your space to share stories, connect with dreamers, and explore an emotionally immersive blogging universe.
          </p>
          <p>
            Write freely, discover others’ journeys, and express yourself without limits. Whether you're a poet, thinker, or silent observer — there's a place for you here.
          </p>
          <p className={styles.aboutTagline}>Speak your soul. 💫</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;
