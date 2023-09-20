import * as admin from 'firebase-admin';

import CREDENTIALS from '../constants/CREDENTIALS';

const FirebaseServiceAccountConfig = {
  type: 'service_account',
  project_id: CREDENTIALS.FIREBASE_PROJECT_ID,
  private_key_id: CREDENTIALS.FIREBASE_PRIVATE_KEY_ID,
  private_key: CREDENTIALS.FIREBASE_PRIVATE_KEY,
  client_email: CREDENTIALS.FIREBASE_CLIENT_EMAIL,
  client_id: CREDENTIALS.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mwigf%40saullogames-79491.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
} as admin.ServiceAccount;

export default FirebaseServiceAccountConfig;
