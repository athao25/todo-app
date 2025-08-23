/**
 * Test User Data
 * Contains test user profiles and preferences
 */

export const TestUsers = {
  default: {
    name: 'Test User',
    preferences: {
      theme: 'default',
      notifications: true,
    },
  },
  admin: {
    name: 'Admin User',
    preferences: {
      theme: 'dark',
      notifications: true,
    },
  },
  guest: {
    name: 'Guest User',
    preferences: {
      theme: 'light',
      notifications: false,
    },
  },
};