import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Configuração do Firebase com as credenciais corretas
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validar configuração
const validateFirebaseConfig = () => {
  const requiredFields = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingFields = requiredFields.filter(field => !import.meta.env[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Campos obrigatórios do Firebase não configurados:', missingFields);
    throw new Error(`Configuração Firebase incompleta: ${missingFields.join(', ')}`);
  }

  // Verificar se não são valores placeholder
  if (firebaseConfig.apiKey === 'your_api_key_here') {
    console.error('❌ API Key do Firebase ainda é um placeholder');
    throw new Error('Configure a API Key real do Firebase no arquivo .env');
  }

  console.log('✅ Configuração Firebase validada com sucesso');
};

// Validar antes de inicializar
validateFirebaseConfig();

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configurar emuladores apenas em desenvolvimento local
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔧 Emuladores Firebase conectados');
  } catch (error) {
    console.log('ℹ️ Emuladores já conectados ou não disponíveis');
  }
}

// Log de configuração (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔥 Firebase inicializado:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    environment: import.meta.env.MODE
  });
}

export default app;