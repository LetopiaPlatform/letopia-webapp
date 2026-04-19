export const PLATFORM_ROLES = {
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  LEARNER: 'Learner',
} as const;

export const ERROR_MESSAGES = {
  TIMEOUT: 'Request timed out',
  NETWORK: 'Unable to connect to server',
  DEFAULT: 'Something went wrong',
  REQUEST_FAILED: 'Request failed',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/', icon: '/assets/home.svg' },
  { label: 'Communities', href: '/communities', icon: '/assets/communities.svg' },
  { label: 'Projects', href: '/projects', icon: '/assets/projects.svg' },
  { label: 'Roadmaps', href: '/roadmaps', icon: '/assets/roadmaps.svg' },
] as const;

export const NAV_ICONS = {
  SEARCH: '/assets/search.svg',
  FILTER: '/assets/filter.svg',
} as const;

export const AUTH_ICONS = {
  USER: '/assets/user.svg',
  PHONE: '/assets/phone.svg',
  EMAIL: '/assets/email.svg',
  PASSWORD: '/assets/password.svg',
} as const;

// ── Auth pages ─────────────────────────────────────────────────
export const AUTH_ASSETS = {
  REGISTER_ILLUSTRATION: '/assets/auth-illustration.svg',
  LOGIN_ILLUSTRATION: '/assets/login-illustration.svg',
} as const;

export const AUTH_STRINGS = {
  REGISTER: {
    TITLE: 'Create Account',
    SUBTITLE: "Let's get you all set up so you can access your personal account.",
    SUBMIT: 'Sign up',
    SUBMIT_LOADING: 'Creating account...',
    GOOGLE_BUTTON: 'Sign up with Google',
    TERMS_PREFIX: 'I agree to all the',
    TERMS_LINK: 'Terms',
    TERMS_AND: 'and',
    PRIVACY_LINK: 'Privacy Policies',
    LOGIN_PROMPT: 'Already have an account?',
    LOGIN_LINK: 'Login',
  },
  LOGIN: {
    TITLE: 'Welcome Back',
    SUBTITLE: 'Login to access your account',
    SUBMIT: 'Log in',
    SUBMIT_LOADING: 'Signing in...',
    GOOGLE_BUTTON: 'Sign in with Google',
    FORGOT_PASSWORD: 'Forgot Password',
    REMEMBER_ME: 'Remember me',
    REGISTER_PROMPT: "Don't have an account?",
    REGISTER_LINK: 'Sign up',
  },
  VERIFY_EMAIL: {
    TITLE: 'Check your Email',
    SUBTITLE: 'An authentication code has been sent to your email.',
    BACK_LINK: 'Back to Login',
    RESEND_PROMPT: "Didn't receive a code?",
    RESEND_LINK: 'Resend',
    SUBMIT: 'Verify',
    SUBMIT_LOADING: 'Verifying...',
  },
  FORGOT_PASSWORD: {
    TITLE: 'Forgot your password?',
    SUBTITLE: "Don't worry, happens to all of us. Enter your email below to recover your password",
    BACK_LINK: 'Back to login',
    EMAIL_PLACEHOLDER: 'Email',
    SUBMIT: 'Send',
    SUBMIT_LOADING: 'Sending...',
    REGISTER_PROMPT: "Don't have an account?",
    REGISTER_LINK: 'Sign up',
  },
  VERIFY_RESET_CODE: {
    TITLE: 'Check your Email',
    SUBTITLE: 'A password reset code has been sent to your email.',
    BACK_LINK: 'Back to login',
    RESEND_PROMPT: "Didn't receive a code?",
    RESEND_LINK: 'Resend',
    SUBMIT: 'Verify',
    SUBMIT_LOADING: 'Verifying...',
  },
  SET_PASSWORD: {
    TITLE: 'Set a Password',
    SUBTITLE:
      'Your previous password has been reseted. Please set a new password for your account.',
    NEW_PASSWORD_PLACEHOLDER: 'New Password',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm New Password',
    SUBMIT: 'Reset password',
    SUBMIT_LOADING: 'Resetting...',
  },
  DIVIDER: 'Or',
} as const;
