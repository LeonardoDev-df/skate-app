import { useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useGameTimer = () => {
  useEffect(() => {
    // Monitorar convites que precisam expirar
    const q = query(
      collection(db, 'GameInvites'),
      where('status', '==', 'Aguardando')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      
      snapshot.docs.forEach(async (docSnap) => {
        const data = docSnap.data();
        const expiresAt = data.expiresAt?.toDate();
        
        if (expiresAt && now > expiresAt) {
          // Expirar convite automaticamente
          await updateDoc(doc(db, 'GameInvites', docSnap.id), {
            status: 'Expirado'
          });
        }
      });
    });

    return unsubscribe;
  }, []);
};