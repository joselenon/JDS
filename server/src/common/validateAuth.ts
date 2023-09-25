import { AuthError } from '../config/errorTypes/ClientErrors';
import { IJWTPayload } from '../config/interfaces/IJWT';
import JWTService from '../services/JWTService';
import checkIfUserAlreadyExistsByDocId from './checkIfUserAlreadyExistsByDocId';

export type TValidateAuthFn = (
  authorization: string | null,
) => Promise<IJWTPayload>;

const validateAuth: TValidateAuthFn = async (authorization: string | null) => {
  try {
    // JWT Verification
    if (!authorization) throw new AuthError();
    const userValidated = JWTService.validateJWT(
      authorization?.replace('Bearer ', ''),
    );

    // DB Verification
    await checkIfUserAlreadyExistsByDocId(userValidated.userDocId);
    return userValidated;
  } catch (err: any) {
    throw new AuthError();
  }
};

export default validateAuth;
