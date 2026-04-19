import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthPageLayout } from '@/components/layout/AuthPageLayout';
import { GlassCard } from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/hooks/useAuth';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validators';
import { AUTH_ICONS, AUTH_STRINGS } from '@/lib/constants';

export function SetPasswordPage() {
  const location = useLocation();
  const state = location.state as { email?: string; code?: string } | null;
  const email = state?.email;
  const code = state?.code;

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Missing email or code → restart the flow
  if (!email || !code) return <Navigate to="/forgot-password" replace />;

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword({
      email,
      code,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <AuthPageLayout>
      <GlassCard className="relative z-10 flex w-full flex-col items-center justify-center gap-8 sm:gap-10">
        {/* Header */}
        <div className="flex w-full flex-col items-center gap-4">
          <h1 className="text-3xl sm:text-[40px] sm:leading-tight font-bold text-[#24252C] text-center">
            {AUTH_STRINGS.SET_PASSWORD.TITLE}
          </h1>
          <p className="w-full text-center text-sm sm:text-base font-normal text-[#313131]">
            {AUTH_STRINGS.SET_PASSWORD.SUBTITLE}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-8">
          {/* New Password */}
          <div className="space-y-1">
            <div className="relative">
              <img
                src={AUTH_ICONS.PASSWORD}
                alt=""
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 size-5"
              />
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder={AUTH_STRINGS.SET_PASSWORD.NEW_PASSWORD_PLACEHOLDER}
                className="h-14 rounded-lg border-0 border-b border-muted-foreground/30 bg-transparent pl-12 pr-12 shadow-none focus-visible:ring-0 focus-visible:border-brand-500"
                {...register('newPassword')}
                aria-invalid={!!errors.newPassword}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-caption text-destructive">{errors.newPassword.message}</p>
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
                placeholder={AUTH_STRINGS.SET_PASSWORD.CONFIRM_PASSWORD_PLACEHOLDER}
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
                {showConfirmPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-caption text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-xl bg-[#824892] text-center text-base font-semibold text-white hover:bg-[#6f3a80]"
          >
            {isPending
              ? AUTH_STRINGS.SET_PASSWORD.SUBMIT_LOADING
              : AUTH_STRINGS.SET_PASSWORD.SUBMIT}
          </Button>
        </form>
      </GlassCard>
    </AuthPageLayout>
  );
}
