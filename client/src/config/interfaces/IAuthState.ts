import { IUserJWTPayload } from './IUser';

export default interface IAuthState {
  userInfo: IUserJWTPayload | undefined;
}
