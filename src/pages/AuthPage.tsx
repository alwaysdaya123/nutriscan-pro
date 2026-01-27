import { Header } from '@/components/layout/Header';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

type AuthPageProps = {
  mode: 'signin' | 'signup';
};

export default function AuthPage({ mode }: AuthPageProps) {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="container py-12">
        <div className="max-w-md mx-auto">
          <AuthForm mode={mode} />
        </div>
      </main>
    </div>
  );
}
