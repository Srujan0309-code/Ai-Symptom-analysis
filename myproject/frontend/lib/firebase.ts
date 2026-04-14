import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEWjJYRTo2dUpy-5KgzX0s85JJrL8_bq0",
  authDomain: "gdg-project-e356c.firebaseapp.com",
  projectId: "gdg-project-e356c",
  storageBucket: "gdg-project-e356c.firebasestorage.app",
  messagingSenderId: "715993376134",
  appId: "1:715993376134:web:f8dfb671eb11cbf65af807",
  measurementId: "G-1DXB7X6RNH"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
