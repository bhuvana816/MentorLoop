// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
  applyActionCode,
  reload,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isVerified: boolean;
  verifyEmail: (oobCode: string) => Promise<void>;
  checkEmailVerification: () => Promise<void>;
  resendVerification: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const updateVerificationStatus = async (user: User | null) => {
    try {
      await auth.currentUser?.reload();
      const refreshedUser = auth.currentUser;

      if (refreshedUser) {
        setCurrentUser(refreshedUser);
        const verified = refreshedUser.emailVerified;
        setIsVerified(verified);

        const userDoc = doc(db, 'users', refreshedUser.uid);
        await updateDoc(userDoc, {
          isVerified: verified,
          lastLogin: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      setIsVerified(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await updateVerificationStatus(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkEmailVerification = async () => {
    if (currentUser) {
      await updateVerificationStatus(currentUser);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const actionCodeSettings = {
      url: `${window.location.origin}/verify-email`,
      handleCodeInApp: true
    };

    await sendEmailVerification(user, actionCodeSettings);

    await setDoc(doc(db, 'users', user.uid), {
      email,
      name,
      displayName: name,
      createdAt: new Date().toISOString(),
      isVerified: false
    });
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await reload(user); // Refresh user to check latest verification

    if (!user.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email before logging in.');
    }

    await updateVerificationStatus(user);
  };

  const logout = async () => {
    await signOut(auth);
    setIsVerified(false);
    navigate('/');
  };

  const verifyEmail = async (oobCode: string) => {
    await applyActionCode(auth, oobCode);
    await auth.currentUser?.reload();
    await updateVerificationStatus(auth.currentUser);
    navigate('/profile');
  };

  const resendVerification = async () => {
    if (!currentUser) return;

    const actionCodeSettings = {
      url: `${window.location.origin}/verify-email`,
      handleCodeInApp: true
    };

    await sendEmailVerification(currentUser, actionCodeSettings);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signup,
        login,
        logout,
        isVerified,
        verifyEmail,
        checkEmailVerification,
        resendVerification,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
