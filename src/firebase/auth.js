import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './config';

export { auth };

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    // Add additional scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error details:', {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential
    });
    throw error;
  }
}; 