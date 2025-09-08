import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the auth callback
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error during auth callback:', error);
        navigate('/');
        return;
      }

      // Redirect to home page after successful authentication
      navigate('/');
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center arabic space-y-6">
        <p className="mb-4 text-xl text-muted-foreground">جاري التحقق من الحساب...</p>
      </div>
    </div>
  );
};

export default AuthCallback;