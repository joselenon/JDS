import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

const CREDENTIALS = {
  SENTRY_DSN: process.env.SENTRY_DSN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  STEAM_CLIENT_SECRET: process.env.STEAM_CLIENT_SECRET,
};

export default CREDENTIALS;
