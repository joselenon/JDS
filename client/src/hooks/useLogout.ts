// Invalidar JWT após logout (Redis) (Priority: ****)
import Cookies from 'js-cookie';

import { useDispatch } from 'react-redux';
import { setToken } from '../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';
import { JWTCookie } from '../config/app/CookiesConfig';

export default function useLogout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    const logout = dispatch(setToken(null));
    Cookies.remove(JWTCookie.key);
    navigate('/');
    window.location.reload();
    return logout;
  };

  return handleLogout;
}
