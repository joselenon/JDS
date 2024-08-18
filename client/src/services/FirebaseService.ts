import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAqbrGleuzpKVI1Zb9SzXdJi-xfhDBxJJM',
  authDomain: 'saullogames-79491.firebaseapp.com',
  projectId: 'saullogames-79491',
  storageBucket: 'saullogames-79491.appspot.com',
  messagingSenderId: '730345969951',
  appId: '1:730345969951:web:84f9cc0a2bcc364d7e382a',
  measurementId: 'G-YP8TWP4P71',
};

const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };
