// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyABRAqmsUz4rQg6EQyJifB50p-c0eHYKjc',
  authDomain: 'blog-3f363.firebaseapp.com',
  projectId: 'blog-3f363',
  storageBucket: 'log-3f363.firebasestorage.app',
  messagingSenderId: '749532411395',
  appId: '1:749532411395:web:d2d3829dee3f5f4f414036',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
