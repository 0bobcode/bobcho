import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyByCX-4LMVDSJYYHtG7dPQecuR3vY7yyfA",
    authDomain: "ivy-dashboard-95537.firebaseapp.com",
    databaseURL: "https://ivy-dashboard-95537-default-rtdb.firebaseio.com",
    projectId: "ivy-dashboard-95537",
    storageBucket: "ivy-dashboard-95537.firebasestorage.app",
    messagingSenderId: "555090130444",
    appId: "1:555090130444:web:a1cdb6a1b43071b05be029",
    measurementId: "G-SNCT2M63DS"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
