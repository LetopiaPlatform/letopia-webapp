import { OtpInput } from '@/components/shared/OtpInput';
import { GlassCard } from '@/components/shared/GlassCard';
import { AuthPageLayout } from '@/components/layout/AuthPageLayout';
import { Button } from '@/components/ui/button';
import { useResendCode, useVerifyEmail } from '@/hooks/useAuth';
import { useAuthContext } from '@/context/AuthContext';
import { AUTH_STRINGS } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

const RESEND_COOLDOWN = 60; // seconds

export function VerifyEmailPage() {
  const location = useLocation();
  const state = location.state as { email?: string; autoResend?: boolean } | null;
  const { isAuthenticated } = useAuthContext();
  const email = state?.email;
  const autoResend = state?.autoResend;

  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(() => {
    const stored = sessionStorage.getItem('verify_cooldown_end');
    if (stored) {
      const remaining = Math.ceil((Number(stored) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return RESEND_COOLDOWN;
  });

  const { mutate: verifyEmail, isPending } = useVerifyEmail();
  const { mutate: resendCode, isPending: isResending } = useResendCode();

  // Countdown timer for resend (persisted)
  useEffect(() => {
    if (cooldown <= 0) {
      sessionStorage.removeItem('verify_cooldown_end');
      return;
    }
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-send code when redirected from login with 403
  useEffect(() => {
    if (autoResend && email && cooldown === 0) {
      resendCode(email);
      setCooldown(RESEND_COOLDOWN);
      sessionStorage.setItem('verify_cooldown_end', String(Date.now() + RESEND_COOLDOWN * 1000));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Already logged in (e.g. Google user) → go home
  if (isAuthenticated) return <Navigate to="/" replace />;

  // No email in state → go to register
  if (!email) return <Navigate to="/register" replace />;

  const handleVerify = () => {
    if (otp.length !== 6 || isPending) return;
    verifyEmail({ email, code: otp });
  };

  const handleResend = () => {
    if (cooldown > 0 || isResending) return;
    resendCode(email);
    setCooldown(RESEND_COOLDOWN);
    sessionStorage.setItem('verify_cooldown_end', String(Date.now() + RESEND_COOLDOWN * 1000));
    setOtp('');
  };

  // Mask email: m***@gmail.com
  const maskedEmail = email.replace(
    /^(.{1,2})(.*)(@.*)$/,
    (_, start, _mid, end) => `${start}${'*'.repeat(4)}${end}`
  );

  return (
    <AuthPageLayout>
      {/* Card */}
      <GlassCard className="relative z-10 flex w-full flex-col items-center justify-center gap-8 sm:gap-10">
        {/* Header */}
        <div className="flex w-full flex-col items-center gap-4">
          <Link
            to="/login"
            className="inline-flex w-full items-center gap-1 text-sm font-medium text-[#313131] transition-colors hover:text-black"
          >
            <img src="/assets/chevron_back.svg" alt="" aria-hidden="true" className="size-6" />
            {AUTH_STRINGS.VERIFY_EMAIL.BACK_LINK}
          </Link>
          <h1 className="text-3xl sm:text-[40px] sm:leading-tight font-bold text-[#24252C] text-center">
            {AUTH_STRINGS.VERIFY_EMAIL.TITLE}
          </h1>
          <p className="w-full text-center text-sm sm:text-base font-normal text-[#313131]">
            {AUTH_STRINGS.VERIFY_EMAIL.SUBTITLE} <span className="font-medium">{maskedEmail}</span>
          </p>
        </div>

        {/* OTP input + Resend */}
        <div className="flex w-full flex-col items-center gap-4 sm:items-start">
          <OtpInput value={otp} onChange={setOtp} onSubmit={handleVerify} disabled={isPending} />

          <p className="w-full text-sm font-medium text-[#313131]">
            {AUTH_STRINGS.VERIFY_EMAIL.RESEND_PROMPT}{' '}
            {cooldown > 0 ? (
              <span className="font-semibold text-[#883dbd]">Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-semibold text-[#883dbd] transition-colors hover:text-[#6a0dad] disabled:opacity-50"
              >
                {AUTH_STRINGS.VERIFY_EMAIL.RESEND_LINK}
              </button>
            )}
          </p>
        </div>

        {/* Verify button */}
        <Button
          onClick={handleVerify}
          disabled={otp.length !== 6 || isPending}
          className="h-[50px] w-full rounded-xl bg-[#824892] text-center text-base font-semibold text-white hover:bg-[#6f3a80]"
        >
          {isPending ? AUTH_STRINGS.VERIFY_EMAIL.SUBMIT_LOADING : AUTH_STRINGS.VERIFY_EMAIL.SUBMIT}
        </Button>
      </GlassCard>
    </AuthPageLayout>
  );
}
