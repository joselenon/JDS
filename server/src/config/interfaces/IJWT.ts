import { IUserJWTPayload } from './IUser';

// export interface IJWTPayload extends IFirebaseQueryResponse<IUser> {} // JWT Protocol configured to have query of a user as payload (Change generics if needed)
export interface IJWTPayload extends IUserJWTPayload {} // JWT Protocol configured to have query of a user as payload (Change generics if needed)

export interface IJWTService {
  signJWT(payload: IJWTPayload): string | undefined;
  validateJWT(token: string): IJWTPayload | void;
}
