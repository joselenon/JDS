import { useSelector } from 'react-redux';
import IReduxStore from '../config/interfaces/IReduxStore';

export default function useGetAuthState() {
  const auth = useSelector((state: IReduxStore) => state.auth);
  return auth;
}
