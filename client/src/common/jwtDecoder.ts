import jwtDecode from 'jwt-decode';

export default function decodeJWT<T>(token: string): T | undefined {
  const decoded: T = jwtDecode(token);
  return decoded;
}
