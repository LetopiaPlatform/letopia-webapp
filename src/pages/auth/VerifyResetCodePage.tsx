import { OtpInput } from '@/components/shared/OtpInput';
import { GlassCard } from '@/components/shared/GlassCard';
import { AuthPageLayout } from '@/components/layout/AuthPageLayout';
import { Button } from '@/components/ui/button';
import { useForgotPassword } from '@/hooks/useAuth';
import { AUTH_STRINGS } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

const RESEND_COOLDOWN = 60; // seconds
const COOLDOWN_KEY = 'reset_code_cooldown_end';

export function VerifyResetCodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { email?: string } | null;
  const email = state?.email;

  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(() => {
    const stored = sessionStorage.getItem(COOLDOWN_KEY);
    if (stored) {
      const remaining = Math.ceil((Number(stored) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return RESEND_COOLDOWN;
  });

  const { mutate: resendCode, isPending: isResending } = useForgotPassword();

  useEffect(() => {
    if (cooldown <= 0) {
      sessionStorage.removeItem(COOLDOWN_KEY);
      return;
    }
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // No email in state → go to forgot-password
  if (!email) return <Navigate to="/forgot-password" replace />;

  const handleVerify = () => {
    if (otp.length !== 6) return;
    // No backend verify step — carry email+code to the reset-password screen
    navigate('/reset-password', { state: { email, code: otp } });
  };

  const handleResend = () => {
    if (cooldown > 0 || isResending) return;
    resendCode({ email });
    setCooldown(RESEND_COOLDOWN);
    sessionStorage.setItem(COOLDOWN_KEY, String(Date.now() + RESEND_COOLDOWN * 1000));
    setOtp('');
  };

  const maskedEmail = email.replace(
    /^(.{1,2})(.*)(@.*)$/,
    (_, start, _mid, end) => `${start}${'*'.repeat(4)}${end}`
  );

  return (
    <AuthPageLayout>
      <GlassCard className="relative z-10 flex w-full flex-col items-center justify-center gap-8 sm:gap-10">
        {/* Header */}
        <div className="flex w-full flex-col items-center gap-4">
          <Link
            to="/login"
            className="inline-flex w-full items-center gap-1 text-sm font-medium text-[#313131] transition-colors hover:text-black"
          >
            <img src="/assets/chevron_back.svg" alt="" aria-hidden="true" className="size-6" />
            {AUTH_STRINGS.VERIFY_RESET_CODE.BACK_LINK}
          </Link>
          <h1 className="text-3xl sm:text-[40px] sm:leading-tight font-bold text-[#24252C] text-center">
            {AUTH_STRINGS.VERIFY_RESET_CODE.TITLE}
          </h1>
          <p className="w-full text-center text-sm sm:text-base font-normal text-[#313131]">
            {AUTH_STRINGS.VERIFY_RESET_CODE.SUBTITLE}{' '}
            <span className="font-medium">{maskedEmail}</span>
          </p>
        </div>

        {/* OTP input + Resend */}
        <div className="flex w-full flex-col items-center gap-4 sm:items-start">
          <OtpInput value={otp} onChange={setOtp} onSubmit={handleVerify} />

          <p className="w-full text-sm font-medium text-[#313131]">
            {AUTH_STRINGS.VERIFY_RESET_CODE.RESEND_PROMPT}{' '}
            {cooldown > 0 ? (
              <span className="font-semibold text-[#883dbd]">Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-semibold text-[#883dbd] transition-colors hover:text-[#6a0dad] disabled:opacity-50"
              >
                {AUTH_STRINGS.VERIFY_RESET_CODE.RESEND_LINK}
              </button>
            )}
          </p>
        </div>

        {/* Verify button */}
        <Button
          onClick={handleVerify}
          disabled={otp.length !== 6}
          className="h-[50px] w-full rounded-xl bg-[#824892] text-center text-base font-semibold text-white hover:bg-[#6f3a80]"
        >
          {AUTH_STRINGS.VERIFY_RESET_CODE.SUBMIT}
        </Button>
      </GlassCard>
    </AuthPageLayout>
  );
}
