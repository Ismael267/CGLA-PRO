"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user');
  console.log('User from localStorage:', user);
  const { isAuthenticated, isLoading, logout, refreshAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = !isPublicRoute;
  // console.log("AuthGuard - isAuthenticated:", isAuthenticated);

  useEffect(() => {
    // Éviter les redirections multiples
    if (isRedirecting) return;
    
    if (!isLoading) {
      // Rediriger vers la page de connexion si non authentifié sur une route protégée
      if (!isAuthenticated && isProtectedRoute) {
        setIsRedirecting(true);
        router.push("/");
        return;
      }
      
      // Rediriger vers le dashboard si authentifié sur une route publique
      if (isAuthenticated && isPublicRoute) {
        setIsRedirecting(true);
        router.push("/dashboard");
        return;
      }
    }
  }, [isAuthenticated, isLoading, isProtectedRoute, isPublicRoute, router, isRedirecting]);

  // Afficher un spinner pendant le chargement
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Ne rien afficher si redirection en cours ou état incohérent
  if (isRedirecting || 
      (!isAuthenticated && isProtectedRoute) || 
      (isAuthenticated && isPublicRoute)) {
    return null;
  }

  return <>{children}</>;
}