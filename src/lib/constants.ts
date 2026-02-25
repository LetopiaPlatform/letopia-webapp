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
