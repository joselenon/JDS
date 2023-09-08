import { AuthError } from '../config/errorTypes/ClientErrors';
import { DocumentNotFound } from '../config/errorTypes/SystemErrors';
import { IJWTPayload } from '../config/interfaces/IJWT';
import JWTService from '../services/JWTService';
import checkIfUserAlreadyExistsByDocId from './checkIfUserAlreadyExistsByDocId';

export type TValidateAuthFn = (
  authorization: string | null,
) => Promise<IJWTPayload>;

const validateAuth: TValidateAuthFn = async (authorization: string | null) => {
  // JWT Verification
  try {
    if (!authorization) throw new AuthError();
    const userValidated = JWTService.validateJWT(
      authorization?.replace('Bearer ', ''),
    );

    // DB Verification
    const userInDB = await checkIfUserAlreadyExistsByDocId(
      userValidated.userDocId,
    );
    if (!userInDB) throw new DocumentNotFound();
    return userValidated;
  } catch (err: any) {
    throw new AuthError();
  }
};

export default validateAuth;
