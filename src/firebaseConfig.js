// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configurações do Firebase, extraídas do console do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCVZsFUeAB8Ocv3J0znhZGrkIzyQ1Y8NS4",
    authDomain: "moneymap-a8007.firebaseapp.com",
    projectId: "moneymap-a8007",
    storageBucket: "moneymap-a8007.appspot.com",
    messagingSenderId: "1071954615319",
    appId: "1:1071954615319:web:5fb031ed643f2bcdc71052",
    measurementId: "G-RB3500SR94"
  };

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços de autenticação e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);