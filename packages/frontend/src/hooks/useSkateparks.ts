import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Skatepark {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
}

export const useSkateparks = () => {
  const [skateparks, setSkateparks] = useState<Skatepark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkateparks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar o documento principal do SkatePark
        const skateParkDoc = await getDoc(doc(db, 'SkatePark', 'rrpDJ2CRrrskTQ0hx97o'));
        
        if (skateParkDoc.exists()) {
          const data = skateParkDoc.data();
          const spots = data.Spot || [];
          
          const allSkateparks: Skatepark[] = [];
          
          // Processar cada região
          spots.forEach((spot: any, spotIndex: number) => {
            if (spot.Brasilia && Array.isArray(spot.Brasilia)) {
              spot.Brasilia.forEach((park: any, parkIndex: number) => {
                allSkateparks.push({
                  id: `${spotIndex}-${parkIndex}`,
                  name: park.City || `Skatepark ${parkIndex + 1}`,
                  address: park.Adress || 'Endereço não informado',
                  city: park.City || 'Brasília',
                  region: 'Brasília'
                });
              });
            }
          });
          
          setSkateparks(allSkateparks);
        } else {
          setError('Dados dos skateparks não encontrados');
        }
      } catch (err) {
        console.error('Erro ao buscar skateparks:', err);
        setError('Erro ao carregar skateparks');
      } finally {
        setLoading(false);
      }
    };

    fetchSkateparks();
  }, []);

  return { skateparks, loading, error };
};