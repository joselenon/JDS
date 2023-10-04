import IUser from '../config/interfaces/IUser';
import { ISteamProfile } from '../config/interfaces/ISteamProfile';
import { validUpdateUserPayload } from '../helpers/payloadHelper';
import { IJWTPayload } from '../config/interfaces/IJWT';
import { FirebaseInstance } from '..';

export default class UserService {
  static async createUserThroughSteam(
    steamPayload: ISteamProfile,
  ): Promise<IJWTPayload> {
    const { steamid, personaname, avatarfull } = steamPayload;
    const userDocId = await FirebaseInstance.writeDocument('users', {
      username: personaname,
      steamid: steamid,
      avatar: avatarfull,
      balance: 0,
      tradeLink: '',
      email: '',
    });
    const userExists = await FirebaseInstance.getSingleDocumentByParam<IUser>(
      'users',
      'steamid',
      steamid,
    );
    if (userExists) {
      const { avatar, username } = userExists.body;
      return { avatar, userDocId, username };
    }
    throw new Error('1');
  }

  static async updateInfo(
    userDocId: string,
    payload: any,
  ): Promise<IJWTPayload> {
    const filteredPayload = validUpdateUserPayload(payload);
    const docUpdated = await FirebaseInstance.updateDocument<IUser>(
      'users',
      userDocId,
      filteredPayload,
    );
    const { avatar, username } = docUpdated.body;
    return { avatar, username, userDocId };
  }
}
