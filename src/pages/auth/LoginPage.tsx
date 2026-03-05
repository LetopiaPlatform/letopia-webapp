import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { userLoginSchema, type LoginFormData } from '@/lib/validators';
import { useLogin } from '@/hooks/useAuth';
import { getErrorStatus, getFieldErrors } from '@/lib/api-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/components/ui/Authlayout';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(userLoginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error) => {
        const fieldErrors = getFieldErrors(error);
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            setError(field as keyof LoginFormData, { message });
          });
        } else if (getErrorStatus(error) === 401) {
          setError('root', { message: 'Invalid email or password' });
        } else {
          setError('root', { message: (error as Error).message });
        }
      },
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Please enter your credentials to sign in"
      error={errors.root?.message}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <Input
            {...register('email')}
            type="email"
            startIcon={<Mail size={16} />}
            placeholder="Email"
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-red-500 px-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              startIcon={<Lock size={16} />}
              placeholder="Password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="!border-0 !bg-transparent !p-0 !rounded-none absolute right-3 top-1/2 text-gray-400 -translate-y-1/2"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-red-500 px-1">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot password */}
        <div className="flex justify-end -mt-1">
          <Link to="/forgot-password" className="text-[14px] font-semibold hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Sign up link */}
        <p className="text-center text-[14px] text-gray-500">
          New to LeTopia?{' '}
          <Link to="/signup" className="font-semibold">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
