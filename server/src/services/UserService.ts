import IUser from '../config/interfaces/IUser';
import { ISteamProfile } from '../config/interfaces/ISteamProfile';
import { IJWTPayload } from '../config/interfaces/IJWT';
import { FirebaseInstance } from '..';
import {
  DocumentNotFoundError,
  RegisterError,
} from '../config/errors/classes/SystemErrors';

export default class UserService {
  static async createUserThroughSteam(
    steamPayload: ISteamProfile,
  ): Promise<IJWTPayload> {
    try {
      const { steamid, personaname, avatarfull } = steamPayload;

      const userDocId = await FirebaseInstance.writeDocument('users', {
        username: personaname,
        steamid: steamid,
        avatar: avatarfull,
        balance: 0,
        tradeLink: '',
        email: '',
      });

      const userCreated =
        await FirebaseInstance.getSingleDocumentByParam<IUser>(
          'users',
          'steamid',
          steamid,
        );

      if (userCreated) {
        const { avatar, username } = userCreated.body;
        return { avatar, userDocId, username };
      } else {
        throw new DocumentNotFoundError();
      }
    } catch (err: any) {
      throw new RegisterError(err);
    }
  }

  static async updateInfo(
    userDocId: string,
    payload: any,
  ): Promise<IJWTPayload> {
    const docUpdated = await FirebaseInstance.updateDocument<IUser>(
      'users',
      userDocId,
      payload,
    );
    const { avatar, username } = docUpdated.body;
    return { avatar, username, userDocId };
  }
}
