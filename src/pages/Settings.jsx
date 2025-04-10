import { useState, useEffect } from 'react';
import { auth, storage, db } from '../firebaseConfig';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import styles from './Settings.module.css';

const predefinedAvatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
];

const Settings = () => {
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPreAvatar, setSelectedPreAvatar] = useState(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      setPreview(currUser?.photoURL || null);
      setDisplayName(currUser?.displayName || '');
    });
    return () => unsub();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedPreAvatar(null);
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file');
    }
  };

  const handlePreAvatarClick = (url) => {
    setSelectedPreAvatar(url);
    setAvatarFile(null);
    setPreview(url);
  };

  const handleRemoveAvatar = () => {
    setSelectedPreAvatar(null);
    setAvatarFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!user) return;
    setUploading(true);

    let photoURL = null;

    try {
      if (avatarFile) {
        const fileRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
        await uploadBytes(fileRef, avatarFile);
        photoURL = await getDownloadURL(fileRef);
      } else if (selectedPreAvatar) {
        photoURL = selectedPreAvatar;
      }

      await updateProfile(user, {
        photoURL: photoURL || null,
        displayName: displayName || user.email.split('@')[0],
      });

      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          displayName: displayName || user.email.split('@')[0],
          photoURL: photoURL || null,
        },
        { merge: true }
      );

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }

    setUploading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Update Profile</h2>

      {preview && (
        <img src={preview} alt="Avatar Preview" className={styles.avatarPreview} />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
      />

      <div className={styles.preAvatarGrid}>
        {predefinedAvatars.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Avatar ${i + 1}`}
            className={`${styles.preAvatar} ${
              selectedPreAvatar === url ? styles.selected : ''
            }`}
            onClick={() => handlePreAvatarClick(url)}
          />
        ))}
      </div>

      <button
        onClick={handleRemoveAvatar}
        className={styles.uploadButton}
        disabled={uploading}
      >
        Remove Avatar
      </button>

      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className={styles.fileInput}
      />

      <button
        onClick={handleUpload}
        className={styles.uploadButton}
        disabled={uploading}
      >
        {uploading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default Settings;
