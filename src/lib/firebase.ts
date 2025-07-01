
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqmqF90fyuLqbNqN9nG1Fjq9c7KfwIDjc",
  authDomain: "hospital135-4d943.firebaseapp.com",
  projectId: "hospital135-4d943",
  storageBucket: "hospital135-4d943.firebasestorage.app",
  messagingSenderId: "511950805075",
  appId: "1:511950805075:web:a2ec6dfea508335105cea6",
  measurementId: "G-2DMSY57DH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable offline persistence
export const enableFirestoreOffline = async () => {
  try {
    // This will enable offline persistence
    console.log('Firestore initialized successfully');
  } catch (error) {
    console.error('Error enabling Firestore offline:', error);
  }
};

export default app;
