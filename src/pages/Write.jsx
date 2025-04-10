import { useState, useEffect } from 'react';
import styles from './Write.module.css';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('⚠️ You must be logged in to post a story.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'stories'), {
        title,
        content,
        createdAt: Timestamp.now(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL || ''
      });

      alert('🎉 Story posted successfully!');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error posting story:', error);
      alert('❌ Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <>
    <div className={styles.container}>
      <h1 className={styles.heading}>Write Your Tale</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title Your Tale..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          required
        />
        <textarea
          placeholder="Weave your story here, let it unfold like whispers on parchment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
          required
        />
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Sending...' : 'Share Your Story 🌟'}
        </button>
      </form>
    </div>
    </>
  );
};

export default Write;