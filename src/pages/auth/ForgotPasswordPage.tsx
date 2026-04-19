import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AuthPageLayout } from '@/components/layout/AuthPageLayout';
import { GlassCard } from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForgotPassword } from '@/hooks/useAuth';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators';
import { AUTH_ICONS, AUTH_STRINGS } from '@/lib/constants';

export function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data);
  };

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
            {AUTH_STRINGS.FORGOT_PASSWORD.BACK_LINK}
          </Link>
          <h1 className="text-3xl sm:text-[40px] sm:leading-tight font-bold text-[#24252C] text-center">
            {AUTH_STRINGS.FORGOT_PASSWORD.TITLE}
          </h1>
          <p className="w-full text-center text-sm sm:text-base font-normal text-[#313131]">
            {AUTH_STRINGS.FORGOT_PASSWORD.SUBTITLE}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-8">
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
                placeholder={AUTH_STRINGS.FORGOT_PASSWORD.EMAIL_PLACEHOLDER}
                className="h-14 rounded-lg border-0 border-b border-muted-foreground/30 bg-transparent pl-12 shadow-none focus-visible:ring-0 focus-visible:border-brand-500"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <p className="text-caption text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-[50px] w-full rounded-xl bg-[#824892] text-center text-base font-semibold text-white hover:bg-[#6f3a80]"
          >
            {isPending
              ? AUTH_STRINGS.FORGOT_PASSWORD.SUBMIT_LOADING
              : AUTH_STRINGS.FORGOT_PASSWORD.SUBMIT}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          {AUTH_STRINGS.FORGOT_PASSWORD.REGISTER_PROMPT}{' '}
          <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-600">
            {AUTH_STRINGS.FORGOT_PASSWORD.REGISTER_LINK}
          </Link>
        </p>
      </GlassCard>
    </AuthPageLayout>
  );
}
