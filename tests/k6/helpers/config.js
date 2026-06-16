// Shared configuration for k6 scripts
export const API_URL = __ENV.API_URL || 'http://localhost:3001';
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test credentials (user pre-seeded in the AUT)
export const TEST_USER = {
  username: 'Heath93',
  password: 's3cret',
};