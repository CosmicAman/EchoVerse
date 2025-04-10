import { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import styles from './Profile.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'stories'), where('authorId', '==', user.uid));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(data);
    });

    return () => unsub();
  }, []);

  const confirmDelete = (id, imageUrl) => {
    setDeleteTarget({ id, imageUrl });
    setShowModal(true);
  };

  const handleDelete = async () => {
    const { id, imageUrl } = deleteTarget;
    try {
      await deleteDoc(doc(db, 'stories', id));
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(() => {});
      }
      toast.success('🗑️ Blog deleted!');
    } catch (err) {
      toast.error('❌ Failed to delete: ' + err.message);
    }
    setShowModal(false);
  };

  const handleEdit = (story) => {
    setEditingBlog(story);
    setEditTitle(story.title);
    setEditContent(story.content);
  };

  const submitEdit = async () => {
    if (!editingBlog) return;
    try {
      await updateDoc(doc(db, 'stories', editingBlog.id), {
        title: editTitle,
        content: editContent,
      });
      toast.success('✅ Story updated!');
      setEditingBlog(null);
    } catch (err) {
      toast.error('❌ Update failed: ' + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📚 My Stories</h2>

      {blogs.length === 0 ? (
        <p className={styles.empty}>You haven’t posted any stories yet.</p>
      ) : (
        <div className={styles.grid}>
          {blogs.map((story) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={story.id}
              className={styles.card}
            >
              {story.imageUrl && (
                <img src={story.imageUrl} alt="cover" className={styles.image} />
              )}
              <h3 className={styles.title}>{story.title}</h3>
              <p className={styles.content}>{story.content}</p>
              <div className={styles.btnGroup}>
                <button
                  onClick={() => confirmDelete(story.id, story.imageUrl)}
                  className={`${styles.deleteBtn}`}
                >
                  🗑️ Delete
                </button>
                <button
                  onClick={() => handleEdit(story)}
                  className={`${styles.editBtn}`}
                >
                  ✏️ Edit
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingBlog && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className={styles.modal} initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <h3>Edit Story ✏️</h3>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="New title"
                className={styles.editTitle}
              />
              <textarea
                rows={5}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="New content"
                className={styles.editArea}
              />
              <div className={styles.btnGroup}>
                <button onClick={submitEdit} className={styles.saveBtn}>
                  💾 Save
                </button>
                <button onClick={() => setEditingBlog(null)} className={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className={styles.modal} initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <p>Are you sure you want to delete this blog?</p>
              <div className={styles.btnGroup}>
                <button onClick={handleDelete} className={styles.deleteBtn}>
                  Yes, Delete
                </button>
                <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
