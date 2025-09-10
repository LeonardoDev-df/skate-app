import { useState, useEffect } from 'react';
import { apiService, Skatepark } from '../services/api';

export const useSkateparks = (city?: string) => {
  const [skateparks, setSkateparks] = useState<Skatepark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkateparks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getSkateparks(city);
        setSkateparks(response.skateparks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar skateparks');
        setSkateparks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkateparks();
  }, [city]);

  const refetch = () => {
    const fetchSkateparks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getSkateparks(city);
        setSkateparks(response.skateparks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar skateparks');
        setSkateparks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkateparks();
  };

  return { skateparks, loading, error, refetch };
};

export const useSkatepark = (id: string) => {
  const [skatepark, setSkatepark] = useState<Skatepark | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkatepark = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getSkatepark(id);
        setSkatepark(response.skatepark || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar skatepark');
        setSkatepark(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSkatepark();
    }
  }, [id]);

  return { skatepark, loading, error };
};