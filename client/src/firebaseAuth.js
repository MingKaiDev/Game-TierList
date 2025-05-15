import { initializeApp } from 'firebase/app'
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut, GoogleAuthProvider, signInWithPopup
} from 'firebase/auth'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app  = initializeApp(firebaseConfig)
const auth = getAuth(app)

/* ---------- helpers ---------- */
export const loginWithEmail = (email, pw) =>
  signInWithEmailAndPassword(auth, email, pw)

export const loginWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider())

export const logout = () => signOut(auth)

export const subscribeAuth = (cb) => onAuthStateChanged(auth, cb)

export default auth
