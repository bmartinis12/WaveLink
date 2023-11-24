import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBFeUwXcm-gATP4W5iugcPK4MrB6WMGqRA",
    authDomain: "wavelink-fb780.firebaseapp.com",
    projectId: "wavelink-fb780",
    storageBucket: "wavelink-fb780.appspot.com",
    messagingSenderId: "241758131139",
    appId: "1:241758131139:web:821454c4af0a7e315c6376",
    measurementId: "G-DFZ8N4H43F"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);