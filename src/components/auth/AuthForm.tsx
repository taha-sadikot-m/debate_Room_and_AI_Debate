
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useEmailValidation } from '@/hooks/useEmailValidation';

interface AuthFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  isLogin: boolean;
  loading: boolean;
  onForgotPassword?: () => void;
}

const AuthForm = ({ form, onSubmit, isLogin, loading, onForgotPassword }: AuthFormProps) => {
  const emailValue = form.watch('email');
  const { emailExists, isChecking } = useEmailValidation(emailValue, isLogin);

  const getEmailValidationIcon = () => {
    if (isChecking) {
      return <Loader2 className="absolute right-3 top-3 h-4 w-4 text-gray-400 animate-spin" />;
    }
    if (emailExists === true && !isLogin) {
      return <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />;
    }
    if (emailExists === false && !isLogin) {
      return <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const getEmailValidationMessage = () => {
    if (!isLogin && emailExists === true) {
      return (
        <p className="text-sm text-red-600 mt-1">
          This email is already registered. <span className="underline cursor-pointer">Try signing in instead?</span>
        </p>
      );
    }
    if (!isLogin && emailExists === false && emailValue && emailValue.includes('@')) {
      return (
        <p className="text-sm text-green-600 mt-1">
          Email available
        </p>
      );
    }
    return null;
  };

  return (
    <Form {...form}>
      <form key={isLogin ? 'login' : 'signup'} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="pl-10 pr-10"
                  />
                  {getEmailValidationIcon()}
                </div>
              </FormControl>
              <FormMessage />
              {getEmailValidationMessage()}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="pl-10"
                  />
                </div>
              </FormControl>
              {!isLogin && (
                <FormDescription className="text-xs">
                  Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, a number, and a special character.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {!isLogin && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isLogin && onForgotPassword && (
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              onClick={onForgotPassword}
              className="text-sm p-0 h-auto"
            >
              Forgot your password?
            </Button>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || (!isLogin && emailExists === true)}
          className="w-full gradient-indigo text-white"
        >
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
