import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useGoogleLogin as useGoogleOAuth } from '@react-oauth/google';
import { signUpSchema, type SignUpFormData } from '@/lib/validators';
import { useSignUp, useGoogleLogin } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AUTH_ASSETS, AUTH_ICONS, AUTH_STRINGS } from '@/lib/constants';

export function RegisterPage() {
  const { mutate: signUp, isPending } = useSignUp();
  const { mutate: googleLogin, isPending: isGooglePending } = useGoogleLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleGoogleLogin = useGoogleOAuth({
    onSuccess: (tokenResponse) => {
      googleLogin(tokenResponse.access_token);
    },
    onError: () => {
      // toast handled by mutation onError
    },
  });

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
    <div className="flex min-h-[calc(100vh-72px)]">
      {/* Left side — Illustration (hidden below xl) */}
      <div className="hidden xl:flex xl:w-1/2 items-end justify-center pb-8">
        <img
          src={AUTH_ASSETS.REGISTER_ILLUSTRATION}
          alt="Team collaboration illustration"
          className="max-w-[90%] max-h-156.5 object-contain"
        />
      </div>

      {/* Right side — Form with gradient */}
      <div
        className="w-full xl:w-1/2 flex items-center justify-center rounded-l-3xl px-4 py-8"
        style={{
          background:
            'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(131, 68, 150, 0.3) 100%)',
        }}
      >
        <div className="w-full max-w-xl space-y-4 px-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-[40px] font-bold text-foreground">{AUTH_STRINGS.REGISTER.TITLE}</h1>
            <p className="text-base text-muted-foreground/75">{AUTH_STRINGS.REGISTER.SUBTITLE}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-10">
              {/* Full Name */}
              <div className="space-y-1">
                <div className="relative">
                  <img
                    src={AUTH_ICONS.USER}
                    alt=""
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 size-5"
                  />
                  <Input
                    id="fullName"
                    placeholder="Full Name"
                    className="h-14 rounded-lg border-0 border-b border-muted-foreground/30 bg-transparent pl-12 shadow-none focus-visible:ring-0 focus-visible:border-brand-500"
                    {...register('fullName')}
                    aria-invalid={!!errors.fullName}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-caption text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <div className="relative">
                  <img
                    src={AUTH_ICONS.PHONE}
                    alt=""
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 size-5"
                  />
                  <Input
                    id="phoneNumber"
                    placeholder="Phone Number"
                    className="h-14 rounded-lg border-0 border-b border-muted-foreground/30 bg-transparent pl-12 shadow-none focus-visible:ring-0 focus-visible:border-brand-500"
                    {...register('phoneNumber')}
                    aria-invalid={!!errors.phoneNumber}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-caption text-destructive">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <div className="relative">
                  <img
                    src={AUTH_ICONS.EMAIL}
                    alt=""
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 size-5"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="h-14 rounded-lg border-0 border-b border-muted-foreground/30 bg-transparent pl-12 shadow-none focus-visible:ring-0 focus-visible:border-brand-500"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="text-caption text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="relative">
                  <img
                    src={AUTH_ICONS.PASSWORD}
                    alt=""
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 size-5"
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="h-14 rounded-lg border-0 border-b border-muted-foreground/30 bg-transparent pl-12 pr-12 shadow-none focus-visible:ring-0 focus-visible:border-brand-500"
                    {...register('password')}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-caption text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <div className="relative">
                  <img
                    src={AUTH_ICONS.PASSWORD}
                    alt=""
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 size-5"
                  />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="h-14 rounded-lg border-0 border-b border-muted-foreground/30 bg-transparent pl-12 pr-12 shadow-none focus-visible:ring-0 focus-visible:border-brand-500"
                    {...register('confirmPassword')}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <Eye className="size-5" />
                    ) : (
                      <EyeOff className="size-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-caption text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms checkbox — bordered only, no fill */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="size-5 appearance-none rounded-lg border border-[#824892] bg-transparent cursor-pointer relative checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-[#824892] checked:after:text-sm checked:after:font-bold checked:after:content-['✓']"
              />
              <span className="text-sm text-foreground">
                {AUTH_STRINGS.REGISTER.TERMS_PREFIX}{' '}
                <Link to="/terms" className="font-semibold text-brand-500 hover:text-brand-600">
                  {AUTH_STRINGS.REGISTER.TERMS_LINK}
                </Link>{' '}
                {AUTH_STRINGS.REGISTER.TERMS_AND}{' '}
                <Link to="/privacy" className="font-semibold text-brand-500 hover:text-brand-600">
                  {AUTH_STRINGS.REGISTER.PRIVACY_LINK}
                </Link>
              </span>
            </label>

            {/* Sign up button */}
            <Button
              type="submit"
              variant="brand"
              disabled={isPending || !agreedToTerms || isGooglePending}
              className="w-full h-13.5 rounded-xl text-base"
            >
              {isPending ? AUTH_STRINGS.REGISTER.SUBMIT_LOADING : AUTH_STRINGS.REGISTER.SUBMIT}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-muted-foreground/30" />
            <span className="text-base text-muted-foreground">{AUTH_STRINGS.DIVIDER}</span>
            <div className="h-px flex-1 bg-muted-foreground/30" />
          </div>

          {/* Google sign up */}
          <Button
            type="button"
            variant="outline"
            onClick={() => handleGoogleLogin()}
            disabled={isPending || isGooglePending}
            className="w-full h-13.5 rounded-xl bg-white border-0 shadow-sm text-base font-semibold text-foreground hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {AUTH_STRINGS.REGISTER.GOOGLE_BUTTON}
          </Button>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            {AUTH_STRINGS.REGISTER.LOGIN_PROMPT}{' '}
            <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600">
              {AUTH_STRINGS.REGISTER.LOGIN_LINK}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
