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
import BalanceContextProvider from './contexts/BalanceContext';
import { useSelector } from 'react-redux';
import IReduxStore from './config/interfaces/IReduxStore';
import UserInfoContextProvider from './contexts/UserProfileInfoContext';

function App() {
  const initialCallCompleted = useRef(false);
  const dispatch = useDispatch();

  async function serverStatus() {
    await getServerStatus(dispatch);
  }
  const userInfo = useSelector((state: IReduxStore) => state.auth.userInfo);

  useEffect(() => {
    if (!initialCallCompleted.current) {
      initialCallCompleted.current = true;
      const tokenFromCookies = Cookies.get(JWTCookie.key);
      tokenFromCookies && dispatch(setToken(tokenFromCookies));
      serverStatus();
    }
  }, [dispatch]);

  // Conditional (different based in user logged or not)
  return (
    <BrowserRouter>
      {userInfo ? (
        <UserInfoContextProvider>
          <BalanceContextProvider>
            <Header />
            {/*       <NewsBar /> */}
            <AppRoutes />
            <Footer />
          </BalanceContextProvider>
        </UserInfoContextProvider>
      ) : (
        <>
          <Header />
          <AppRoutes />
          <Footer />
        </>
      )}

      <GLOBAL_STYLES />
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
    </BrowserRouter>
  );
}

export default App;
