
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailValidation = (email: string, isLogin: boolean) => {
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Only check if it's a valid email and we're in signup mode
    if (!email || isLogin || !email.includes('@')) {
      setEmailExists(null);
      return;
    }

    const checkEmail = async () => {
      setIsChecking(true);
      try {
        // Try to sign in with the email and a dummy password to check if user exists
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: 'dummy-password-for-check'
        });

        // If error message indicates invalid credentials, user exists
        // If error message indicates user not found, user doesn't exist
        if (error?.message.includes('Invalid login credentials')) {
          setEmailExists(true);
        } else if (error?.message.includes('User not found') || error?.message.includes('Invalid email')) {
          setEmailExists(false);
        } else {
          // For other errors, we can't determine, so reset
          setEmailExists(null);
        }
      } catch (error) {
        console.log('Email check error:', error);
        setEmailExists(null);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce the check to avoid too many requests
    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [email, isLogin]);

  return { emailExists, isChecking };
};
