"use client";

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/config/firebase';

export function useFirebaseAuth() {
  const { address } = useAccount();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const auth = getAuth(app);
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Sign in when wallet connects
  useEffect(() => {
    if (!address) return;
    
    const auth = getAuth(app);
    
    // Sign in anonymously (you could do a more secure custom token auth in production)
    signInAnonymously(auth).catch((error) => {
      console.error("Firebase auth error:", error);
    });
  }, [address]);
  
  return { firebaseUser, loading };
} 