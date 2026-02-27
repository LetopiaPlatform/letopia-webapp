import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { userSignUpSchema, type SignUpFormData } from '@/lib/validators';
import { useSignup } from '@/hooks/useAuth';
import { getFieldErrors } from '@/lib/api-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/components/ui/Authlayout';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function SignUpPage() {
  const { mutate: signUp, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(userSignUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    signUp(data, {
      onError: (error) => {
        const fieldErrors = getFieldErrors(error);
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            setError(field as keyof SignUpFormData, { message });
          });
        } else {
          setError('root', { message: (error as Error).message });
        }
      },
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join us and start your journey"
      error={errors.root?.message}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <Input
            {...register('fullName')}
            startIcon={<User size={16} />}
            placeholder="Full Name"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 px-1">{errors.fullName.message}</p>
          )}
        </div>

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

        {/* Phone Number */}
        <div className="flex flex-col gap-1">
          <Input
            {...register('phoneNumber')}
            type="tel"
            startIcon={<Phone size={16} />}
            placeholder="Phone Number"
            autoComplete="tel"
            aria-invalid={!!errors.phoneNumber}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 px-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              startIcon={<Lock size={16} />}
              placeholder="Password"
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              startIcon={<Lock size={16} />}
              placeholder="Confirm Password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="!border-0 !bg-transparent !p-0 !rounded-none absolute right-3 top-1/2 text-gray-400 -translate-y-1/2"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-xs text-red-500 px-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Sign Up'
          )}
        </Button>

        {/* Login link */}
        <p className="text-center text-[14px] text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
