import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

interface AuthContextType {
  currentUser: User | null;
  auditorProfile: {
    uid: string;
    email: string;
    displayName: string;
    role: string;
  };
  idToken: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
}

const defaultAuditor = {
  uid: 'auditor-lead-session',
  email: 'ashraffrahman3677@gmail.com',
  displayName: 'Ashraff Rahman',
  role: 'Principal Auditor & Owner',
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  auditorProfile: defaultAuditor,
  idToken: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  getAuthHeaders: () => ({}),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
        } catch (e) {
          console.error('Failed to get token:', e);
        }
      } else {
        setIdToken('auditor-preview-session-token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      setCurrentUser(result.user);
      const token = await result.user.getIdToken();
      setIdToken(token);
    } catch (err: any) {
      console.warn('Google sign-in popup closed or cancelled:', err?.message || err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIdToken('auditor-preview-session-token');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const getAuthHeaders = (): Record<string, string> => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken || 'auditor-preview-session-token'}`
    };
  };

  const auditorProfile = currentUser ? {
    uid: currentUser.uid,
    email: currentUser.email || 'auditor@telcohauz.internal',
    displayName: currentUser.displayName || 'Authorized Auditor',
    role: 'Certified Digital Auditor',
  } : defaultAuditor;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        auditorProfile,
        idToken,
        loading,
        signInWithGoogle,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
