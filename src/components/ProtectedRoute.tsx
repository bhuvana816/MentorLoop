// ✅ Updated ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading, isVerified } = useAuth();
  const location = useLocation();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!currentUser) return;

      const docRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(docRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const profileComplete =
          !!data?.name?.trim() &&
          !!data?.email?.trim() &&
          !!data?.whatsapp?.trim() &&
          !!data?.education?.degree?.trim() &&
          !!data?.education?.specialization?.trim() &&
          !!data?.education?.college?.trim() &&
          !!data?.education?.collegeLocation?.trim() &&
          !!data?.education?.currentYear?.trim() &&
          !!data?.education?.graduationYear?.trim();

        setIsProfileComplete(profileComplete);
      } else {
        setIsProfileComplete(false);
      }

      setCheckingProfile(false);
    };

    if (currentUser) {
      checkProfileCompletion();
    } else {
      setCheckingProfile(false);
    }
  }, [currentUser]);

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (!isProfileComplete && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
