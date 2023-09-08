// In order to deep verification, use common function 'validateAuth' (validates user in DB)
import jwt from 'jsonwebtoken';

import JWTConfig from '../config/app/JWTConfig';
import { IJWTPayload, IJWTService } from '../config/interfaces/IJWT';
import { AuthError } from '../config/errorTypes/ClientErrors';

class JWTService implements IJWTService {
  signJWT(payload: IJWTPayload) {
    if (!JWTConfig.secret) throw new Error('JWT secret is not defined.');
    const token = jwt.sign(payload, JWTConfig.secret, {
      expiresIn: JWTConfig.expiration,
    });
    return token;
  }

  validateJWT(token: string): IJWTPayload {
    if (!JWTConfig.secret) throw new Error('JWT secret is not defined.');
    const validated = jwt.verify(token, JWTConfig.secret) as IJWTPayload;
    if (!validated) throw new AuthError();
    return validated;
  }
}

export default new JWTService();
