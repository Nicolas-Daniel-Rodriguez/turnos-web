import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfRRr_c_1soSpCGW3SF0wWqvn0A8jg-Js",
  authDomain: "ndr-landing-page-react.firebaseapp.com",
  projectId: "ndr-landing-page-react",
  storageBucket: "ndr-landing-page-react.firebasestorage.app",
  messagingSenderId: "117990682851",
  appId: "1:117990682851:web:67258c5497e70e5942d5d6",
  measurementId: "G-91CBGB3V0F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Exporta la autenticación
export const db = getFirestore(app); // Si usas Firestore
