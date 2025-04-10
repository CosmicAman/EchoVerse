import { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import styles from './Community.module.css';

const Community = () => {
  const [stories, setStories] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [replies, setReplies] = useState({});
  const [expandedStories, setExpandedStories] = useState({});
  const [editComment, setEditComment] = useState({});
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStories(data);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (storyId) => {
    if (!auth.currentUser) {
      alert('You must be logged in to like a post.');
      return;
    }

    const storyRef = doc(db, 'stories', storyId);
    const story = stories.find((story) => story.id === storyId);
    const userHasLiked = story?.likes?.includes(auth.currentUser.uid);

    try {
      if (userHasLiked) {
        await updateDoc(storyRef, {
          likes: arrayRemove(auth.currentUser.uid),
        });
      } else {
        await updateDoc(storyRef, {
          likes: arrayUnion(auth.currentUser.uid),
        });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      alert('Failed to update likes. Please try again.');
    }
  };

  const handleAddComment = async (storyId) => {
    const comment = newComments[storyId]?.trim();
    if (!comment) return;

    if (!auth.currentUser) {
      alert('You must be logged in to comment.');
      return;
    }

    const storyRef = doc(db, 'stories', storyId);
    try {
      await updateDoc(storyRef, {
        comments: arrayUnion({
          text: comment,
          author: auth.currentUser.displayName || 'Anonymous',
          uid: auth.currentUser.uid,
          createdAt: new Date().toISOString(),
        }),
      });

      setNewComments((prev) => ({ ...prev, [storyId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleAddReply = async (storyId, commentIndex) => {
    const replyText = replies[`${storyId}-${commentIndex}`]?.trim();
    if (!replyText) return;

    if (!auth.currentUser) {
      alert('You must be logged in to reply.');
      return;
    }

    const storyRef = doc(db, 'stories', storyId);
    const story = stories.find((s) => s.id === storyId);
    if (!story || !story.comments) return;

    const updatedComments = [...story.comments];
    updatedComments[commentIndex].replies = [
      ...(updatedComments[commentIndex].replies || []),
      {
        text: replyText,
        author: auth.currentUser.displayName || 'Anonymous',
        uid: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
      },
    ];

    try {
      await updateDoc(storyRef, {
        comments: updatedComments,
      });

      setReplies((prev) => ({ ...prev, [`${storyId}-${commentIndex}`]: '' }));
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📝 Community Stories</h2>

      {stories.length === 0 ? (
        <p className={styles.empty}>No stories yet. Be the first to share!</p>
      ) : (
        <div className={styles.grid}>
          {stories.map((story) => (
            <div className={styles.card} key={story.id}>
              {story.imageUrl && (
                <img
                  src={story.imageUrl}
                  alt="cover"
                  className={styles.image}
                />
              )}

              <h3 className={styles.title}>
                {story.title || 'Untitled Story'}
              </h3>

              <p
                className={`${styles.content} ${expandedStories[story.id] ? styles.expanded : ''}`}
                onClick={() =>
                  setExpandedStories((prev) => ({
                    ...prev,
                    [story.id]: !prev[story.id],
                  }))
                }
              >
                {story.content
                  ? expandedStories[story.id]
                    ? story.content
                    : story.content.length > 100
                    ? story.content.slice(0, 100) + '... (click to expand)'
                    : story.content
                  : 'No content available.'}
              </p>

              <div className={styles.authorInfo}>
                {story.authorPhoto ? (
                  <img
                    src={story.authorPhoto}
                    alt={story.authorName || 'Author'}
                    className={styles.authorPhoto}
                  />
                ) : (
                  <div className={styles.defaultAvatar}>👤</div>
                )}
                <span className={styles.authorName}>
                  {story.authorName || 'Anonymous'}
                </span>
              </div>

              <button
                className={styles.likeButton}
                onClick={() => handleLike(story.id)}
              >
                ❤️ {story.likes?.length || 0}
              </button>

              <div className={styles.commentSection}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className={styles.commentInput}
                  value={newComments[story.id] || ''}
                  onChange={(e) =>
                    setNewComments((prev) => ({
                      ...prev,
                      [story.id]: e.target.value,
                    }))
                  }
                />
                <button
                  className={styles.commentButton}
                  onClick={() => handleAddComment(story.id)}
                >
                  Post
                </button>
              </div>

              {story.comments?.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <p>
                    <strong>{comment.author}:</strong> {comment.text}
                  </p>

                  <div className={styles.replyInputGroup}>
                    <input
                      type="text"
                      placeholder="Reply as author..."
                      className={styles.replyInput}
                      value={replies[`${story.id}-${index}`] || ''}
                      onChange={(e) =>
                        setReplies((prev) => ({
                          ...prev,
                          [`${story.id}-${index}`]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className={styles.replyButton}
                      onClick={() => handleAddReply(story.id, index)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;