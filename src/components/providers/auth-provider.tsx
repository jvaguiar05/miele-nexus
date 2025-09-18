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
  // Authentication disabled for development
  return <>{children}</>;
}