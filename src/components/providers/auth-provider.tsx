"use client";

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthProviderProps {
  children: React.ReactNode;
}

const publicPaths = ['/login', '/register', '/forgot-password'];

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const isPublicPath = publicPaths.includes(location.pathname);
    
    if (!isLoading) {
      if (!isAuthenticated && !isPublicPath) {
        navigate('/login');
      } else if (isAuthenticated && isPublicPath) {
        navigate('/home');
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}