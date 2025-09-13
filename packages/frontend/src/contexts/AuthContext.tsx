import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface SkatistaData {
  uid: string;
  email: string;
  name: string;
  image: string;
  invitation: any;
  spots: any[];
  status: 'Online' | 'Offline';
  createdAt?: string;
  updatedAt?: string;
}

interface SelectedSpot {
  name: string;
  path: string;
}

interface AuthContextType {
  user: User | null;
  skatista: SkatistaData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, initialSpots?: SelectedSpot[]) => Promise<void>;
  logout: () => Promise<void>;
  updateSkatistaProfile: (data: Partial<SkatistaData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [skatista, setSkatista] = useState<SkatistaData | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados do skatista
  const fetchSkatistaData = async (uid: string) => {
    try {
      const skatistaDoc = await getDoc(doc(db, 'Skatistas', uid));
      if (skatistaDoc.exists()) {
        const data = skatistaDoc.data() as SkatistaData;
        setSkatista({ ...data, uid });
        
        // Atualizar status para Online
        await updateDoc(doc(db, 'Skatistas', uid), {
          status: 'Online',
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do skatista:', error);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchSkatistaData(result.user.uid);
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Credenciais inválidas';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erro de conexão. Verifique sua internet';
          break;
        default:
          errorMessage = error.message || 'Erro ao fazer login';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Registro
  const register = async (email: string, password: string, name: string, initialSpots: SelectedSpot[] = []) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const uid = result.user.uid;

      // Atualizar perfil do Firebase Auth
      await updateProfile(result.user, {
        displayName: name
      });

      // Converter spots selecionados para o formato do Firebase (referências)
      const spotsReferences = initialSpots.map(spot => spot.path);

      // Criar documento na coleção Skatistas com a estrutura exata
      const skatistaData: SkatistaData = {
        uid,
        email,
        name: name.trim(), // Remove espaços extras
        image: 'sk10.jpg', // imagem padrão como no exemplo
        invitation: null,
        spots: spotsReferences, // usar spots selecionados ou array vazio
        status: 'Online',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'Skatistas', uid), skatistaData);
      setSkatista(skatistaData);
      
      console.log('✅ Skatista criado com sucesso:', {
        uid,
        name,
        spotsCount: spotsReferences.length
      });
      
    } catch (error: any) {
      console.error('❌ Erro ao registrar:', error);
      
      let errorMessage = 'Erro ao criar conta';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erro de conexão. Verifique sua internet';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Operação não permitida. Contate o suporte';
          break;
        default:
          errorMessage = error.message || 'Erro ao criar conta';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Atualizar status para Offline antes de fazer logout
      if (user && skatista) {
        await updateDoc(doc(db, 'Skatistas', user.uid), {
          status: 'Offline',
          updatedAt: new Date().toISOString()
        });
      }
      
      await signOut(auth);
      setSkatista(null);
      
      console.log('✅ Logout realizado com sucesso');
      
    } catch (error: any) {
      console.error('❌ Erro ao fazer logout:', error);
      throw new Error(error.message || 'Erro ao fazer logout');
    }
  };

  // Atualizar perfil do skatista
  const updateSkatistaProfile = async (data: Partial<SkatistaData>) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      // Remover campos que não devem ser atualizados diretamente
      delete updateData.uid;
      delete updateData.createdAt;

      await updateDoc(doc(db, 'Skatistas', user.uid), updateData);
      
      // Atualizar estado local
      setSkatista(prev => prev ? { ...prev, ...updateData } : null);
      
      console.log('✅ Perfil atualizado:', updateData);
      
    } catch (error: any) {
      console.error('❌ Erro ao atualizar perfil:', error);
      throw new Error(error.message || 'Erro ao atualizar perfil');
    }
  };

  // Adicionar spot aos favoritos
  const addSpotToFavorites = async (spotPath: string) => {
    if (!user || !skatista) throw new Error('Usuário não autenticado');

    try {
      const currentSpots = skatista.spots || [];
      
      // Verificar se o spot já existe
      if (currentSpots.includes(spotPath)) {
        throw new Error('Spot já adicionado aos favoritos');
      }

      const newSpots = [...currentSpots, spotPath];
      await updateSkatistaProfile({ spots: newSpots });
      
      console.log('✅ Spot adicionado:', spotPath);
      
    } catch (error: any) {
      console.error('❌ Erro ao adicionar spot:', error);
      throw error;
    }
  };

  // Remover spot dos favoritos
  const removeSpotFromFavorites = async (spotPath: string) => {
    if (!user || !skatista) throw new Error('Usuário não autenticado');

    try {
      const currentSpots = skatista.spots || [];
      const newSpots = currentSpots.filter(spot => spot !== spotPath);
      
      await updateSkatistaProfile({ spots: newSpots });
      
      console.log('✅ Spot removido:', spotPath);
      
    } catch (error: any) {
      console.error('❌ Erro ao remover spot:', error);
      throw error;
    }
  };

  // Verificar se um spot está nos favoritos
  const isSpotFavorite = (spotPath: string): boolean => {
    if (!skatista?.spots) return false;
    return skatista.spots.includes(spotPath);
  };

  // Monitorar mudanças de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', user ? `User: ${user.email}` : 'No user');
      
      setUser(user);
      
      if (user) {
        await fetchSkatistaData(user.uid);
      } else {
        setSkatista(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Log do estado atual (apenas em desenvolvimento)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Auth State:', {
        user: user ? { uid: user.uid, email: user.email } : null,
        skatista: skatista ? { 
          uid: skatista.uid, 
          name: skatista.name, 
          spotsCount: skatista.spots?.length || 0,
          status: skatista.status 
        } : null,
        loading
      });
    }
  }, [user, skatista, loading]);

  const value = {
    user,
    skatista,
    loading,
    login,
    register,
    logout,
    updateSkatistaProfile,
    addSpotToFavorites,
    removeSpotFromFavorites,
    isSpotFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para gerenciar spots
export const useSpots = () => {
  const { skatista, addSpotToFavorites, removeSpotFromFavorites, isSpotFavorite } = useAuth();
  
  return {
    spots: skatista?.spots || [],
    spotsCount: skatista?.spots?.length || 0,
    addSpot: addSpotToFavorites,
    removeSpot: removeSpotFromFavorites,
    isFavorite: isSpotFavorite
  };
};

// Tipos exportados para uso em outros componentes
export type { SkatistaData, SelectedSpot, AuthContextType };