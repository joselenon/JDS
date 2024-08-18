// In order to deep verification, use common function 'validateAuth' (validates user in DB)
import jwt from 'jsonwebtoken';

import JWTConfig from '../config/app/JWTConfig';
import { IJWTService } from '../config/interfaces/IJWT';
import { AuthError } from '../config/errors/classes/ClientErrors';
import { IUserJWTPayload } from '../config/interfaces/IUser';

class JWTService implements IJWTService {
  signJWT(payload: IUserJWTPayload) {
    const token = jwt.sign(payload, JWTConfig.secret, {
      expiresIn: JWTConfig.expiration,
    });
    return token;
  }

  validateJWT<T>(token: string, secretOrPublicKey?: jwt.Secret): T {
    const validated = jwt.verify(
      token,
      secretOrPublicKey ? secretOrPublicKey : JWTConfig.secret,
    );
    if (!validated) throw new AuthError();

    return validated as T;
  }
}

export default new JWTService();
