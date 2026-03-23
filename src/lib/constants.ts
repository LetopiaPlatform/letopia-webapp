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

// ── Profile page ───────────────────────────────────────────────
export const PROFILE_ICONS = {
  SETTINGS: '/assets/profile/settings.svg',
  EDIT_USER: '/assets/profile/edit-user-2.svg',
  USER: '/assets/profile/user.svg',
  EMAIL: '/assets/profile/mail-at-sign.svg',
  LOCATION: '/assets/profile/location.svg',
  LINKEDIN: '/assets/profile/linkedin-02.svg',
  LINKEDIN_DISPLAY: '/assets/profile/linkedin-icon.svg',
  GITHUB: '/assets/profile/github-02.svg',
  YOUTUBE: '/assets/profile/youtube.svg',
  BEHANCE: '/assets/profile/behance.svg',
  INSTAGRAM: '/assets/profile/instagram.svg',
  FACEBOOK: '/assets/profile/facebook.svg',
  FIRE: '/assets/profile/fire.svg',
  GRAPH_STAR: '/assets/profile/line-graph-with-star.svg',
  BADGE: '/assets/profile/police-badge.svg',
  TRUST: '/assets/profile/trust.svg',
  BIO: '/assets/profile/bio.svg',
  CAMERA: '/assets/profile/camera-01.svg',
  LINK: '/assets/profile/link-01.svg',
  SKILLS: '/assets/profile/sparkles.svg',
  INTERESTS: '/assets/profile/favorite-circle.svg',
  DASHBOARD: '/assets/profile/dashboard-square.svg',
  CHECKLIST: '/assets/profile/check-list.svg',
  AWARD: '/assets/profile/start-award.svg',
} as const;

export const PROFILE_STRINGS = {
  ROLE_SUFFIX: 'Member',
  BUTTONS: {
    SETTINGS: 'Settings',
    EDIT_PROFILE: 'Edit Profile',
    CANCEL: 'Cancel',
    SAVE_CHANGES: 'Save Changes',
    ADD: 'Add',
  },
  FIELDS: {
    FULL_NAME: 'Full Name',
    EMAIL: 'Email',
    PHONE_NUMBER: 'Phone Number',
    LOCATION: 'Location',
    BIO: 'Bio',
    SOCIAL_LINKS: 'Social Links',
    SKILLS: 'Skills',
    INTERESTS: 'Interests',
  },
  FIELD_PLACEHOLDERS: {
    FULL_NAME: 'e.g. Jane Doe',
    EMAIL: 'you@example.com',
    PHONE_NUMBER: '+20 1153630888',
    LOCATION: 'City, Country',
    BIO: 'Tell us a bit about yourself…',
    SKILL: 'e.g. React, UI/UX Design, Python…',
    INTEREST: 'e.g. Web Design, Machine Learning, Photography…',
    SOCIAL_URL: 'https://…',
  },
  NOT_SAVED_HINT: 'Not saved yet',
  SOCIALS: {
    EMAIL: 'Email',
    LINKEDIN: 'LinkedIn',
    GITHUB: 'GitHub',
    YOUTUBE: 'YouTube',
    BEHANCE: 'Behance',
    INSTAGRAM: 'Instagram',
    FACEBOOK: 'Facebook',
  },
  SECTIONS: {
    SKILLS: 'Skills',
    INTERESTS: 'Interests',
    WEEKLY_ACTIVITY: 'Weekly Activity',
    MY_COMMUNITIES: 'My Communities',
  },
  STATS: {
    TOTAL_POINTS: 'Total Points',
    CURRENT_STREAK: 'Current Streak',
    TASKS_COMPLETED: 'Tasks Completed',
    CONTRIBUTIONS: 'Contributions',
  },
  TABS: {
    OVERVIEW: 'Overview',
    PROJECTS: 'Projects',
    ACHIEVEMENT: 'Achievement',
  },
  EMPTY: {
    NO_COMMUNITIES: "You haven't joined any communities yet.",
    ACTIVITY_SOON: 'Activity chart coming soon',
    PROJECTS_SOON: 'Projects tab coming soon.',
    ACHIEVEMENTS_SOON: 'Achievements tab coming soon.',
  },
} as const;

export type SocialType = keyof typeof PROFILE_STRINGS.SOCIALS;

export const SOCIAL_OPTIONS: ReadonlyArray<{ type: SocialType; label: string; icon: string }> = [
  { type: 'EMAIL', label: 'Email', icon: PROFILE_ICONS.EMAIL },
  { type: 'LINKEDIN', label: 'LinkedIn', icon: PROFILE_ICONS.LINKEDIN },
  { type: 'GITHUB', label: 'GitHub', icon: PROFILE_ICONS.GITHUB },
  { type: 'YOUTUBE', label: 'YouTube', icon: PROFILE_ICONS.YOUTUBE },
  { type: 'BEHANCE', label: 'Behance', icon: PROFILE_ICONS.BEHANCE },
  { type: 'INSTAGRAM', label: 'Instagram', icon: PROFILE_ICONS.INSTAGRAM },
  { type: 'FACEBOOK', label: 'Facebook', icon: PROFILE_ICONS.FACEBOOK },
];

// TODO(backend): these fields are not yet exposed on UserProfileResponse.
// Placeholders so the UI matches the Figma design.
export const PROFILE_PLACEHOLDERS = {
  LOCATION: 'Gharbiya, Egypt',
  SOCIALS: {
    LINKEDIN_URL: 'https://linkedin.com/in/',
    GITHUB_URL: 'https://github.com/',
  },
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
export const FILTER_OPTIONS = [
  { value: 'communities', label: 'Communities', href: '/communities' },
  { value: 'projects', label: 'Projects', href: '/projects' },
];

export const SORT_OPTIONS = [
  { value: 'members', label: 'Most Popular', icon: '/icons/favourite.svg' },
  { value: 'newest', label: 'Latest Communities', icon: '/icons/arrow-reload-vertical.svg' },
  { value: 'name', label: 'Alphabetically', icon: '/icons/arrange-by-letters-a-z.svg' },
];
