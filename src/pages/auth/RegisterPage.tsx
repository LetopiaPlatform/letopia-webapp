import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { signUpSchema, type SignUpFormData } from '@/lib/validators';
import { useSignUp } from '@/hooks/useAuth';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function RegisterPage() {
  const { mutate: signUp, isPending } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    signUp(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-98px)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-h1 font-bold text-foreground">Create account</h1>
          <p className="mt-2 text-body text-muted-foreground">Join Letopia and start learning</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Full name"
                className="rounded-xl bg-muted/50 border-0 pl-10 h-12"
                {...register('fullName')}
                aria-invalid={!!errors.fullName}
              />
            </div>
            {errors.fullName && (
              <p className="text-caption text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                id="phoneNumber"
                placeholder="Phone Number"
                className="rounded-xl bg-muted/50 border-0 pl-10 h-12"
                {...register('phoneNumber')}
                aria-invalid={!!errors.phoneNumber}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-caption text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="rounded-xl bg-muted/50 border-0 pl-10 h-12"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <p className="text-caption text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="rounded-xl bg-muted/50 border-0 pl-10 pr-10 h-12"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-caption text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="rounded-xl bg-muted/50 border-0 pl-10 pr-10 h-12"
                {...register('confirmPassword')}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-caption text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 size-4 rounded border-border accent-brand-500"
            />
            <span className="text-caption text-muted-foreground">
              I&apos;ve read and agree with the{' '}
              <Link to="/terms" className="text-brand-500 hover:text-brand-600">
                Terms and Conditions
              </Link>{' '}
              and the{' '}
              <Link to="/privacy" className="text-brand-500 hover:text-brand-600">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <Button
            type="submit"
            variant="brand"
            disabled={isPending || !agreedToTerms}
            className="w-full"
          >
            {isPending ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="text-center text-body text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
