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
  { label: 'Home', href: '/' },
  { label: 'Communities', href: '/communities' },
  { label: 'Projects', href: '/projects' },
  { label: 'Roadmaps', href: '/roadmaps' },
] as const;

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
  DIVIDER: 'Or',
} as const;
