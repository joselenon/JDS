import IAuthState from './IAuthState';
import IServerState from './IServerState';

export default interface IReduxStore {
  auth: IAuthState;
  server: IServerState;
}
