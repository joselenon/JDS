import React, { useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { setToken } from './redux/features/authSlice';
import GLOBAL_STYLES from './styles/GLOBAL_STYLES';
import Header from './components/Elements/Header';
import AppRoutes from './routes';
import getServerStatus from './common/getServerStatus';
import Footer from './components/Elements/Footer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NewsBar from './components/Elements/NewsBar/';
import { JWTCookie } from './config/app/CookiesConfig';

function App() {
  const initialCallCompleted = useRef(false);
  const dispatch = useDispatch();

  async function serverStatus() {
    await getServerStatus(dispatch);
  }

  useEffect(() => {
    if (!initialCallCompleted.current) {
      initialCallCompleted.current = true;
      const tokenFromCookies = Cookies.get(JWTCookie.key);
      tokenFromCookies && dispatch(setToken(tokenFromCookies));
      serverStatus();
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      {/*       <NewsBar /> */}
      <AppRoutes />
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />

      <GLOBAL_STYLES />
    </BrowserRouter>
  );
}

export default App;
