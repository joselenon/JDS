import IUser, {
  IUserJWTPayload,
  IUserUpdatePayload,
} from '../config/interfaces/IUser';
import { ISteamProfile } from '../config/interfaces/ISteamProfile';
import { FirebaseInstance } from '..';
import {
  DocumentNotFoundError,
  RegisterError,
} from '../config/errors/classes/SystemErrors';
import IGoogleProfile from '../config/interfaces/IGoogleProfile';
import { IAuthValidation } from '../common/validateAuth';
import { UserUpdateInfoError } from '../config/errors/classes/ClientErrors';
import { RESPONSE_CONFIG } from '../config/constants/RESPONSES';
import { IS_EMAIL_UPDATE_ALLOWED } from '../config/logics/systemLogics';

export default class UserService {
  static async createUserThroughSteam(
    steamPayload: ISteamProfile,
  ): Promise<IUserJWTPayload> {
    try {
      const { steamid, personaname, avatarfull } = steamPayload;

      const userDocId = await FirebaseInstance.writeDocument('users', {
        username: personaname,
        steamid: steamid,
        avatar: avatarfull,
        balance: 10,
        tradeLink: '',
        email: '',
      });

      const userCreated =
        await FirebaseInstance.getSingleDocumentByParam<IUser>(
          'users',
          'steamid',
          steamid,
        );

      if (userCreated?.result) {
        const { avatar, username } = userCreated.result;
        return { avatar, userDocId, username };
      } else {
        throw new DocumentNotFoundError();
      }
    } catch (err: any) {
      throw new RegisterError(err);
    }
  }

  static async createUserThroughGoogle(
    googlePayload: IGoogleProfile,
  ): Promise<IUserJWTPayload> {
    try {
      const { name, email, picture } = googlePayload;

      const userDocId = await FirebaseInstance.writeDocument('users', {
        username: name,
        avatar: picture,
        balance: 10,
        tradeLink: '',
        email: {
          value: email,
          verified: true,
          lastEmail: '',
          updatedAt: Date.now(),
        },
      });

      const userCreated = await FirebaseInstance.getDocumentById<IUser>(
        'users',
        userDocId,
      );

      if (userCreated?.result) {
        const { avatar, username } = userCreated.result;
        return { avatar, userDocId, username };
      } else {
        throw new DocumentNotFoundError();
      }
    } catch (err: any) {
      throw new RegisterError(err);
    }
  }

  static async updateInfo(
    authValidation: IAuthValidation,
    payload: IUserUpdatePayload,
  ): Promise<IUserJWTPayload> {
    const { validatedJWTPayload, userInfo } = authValidation;
    const { userDocId } = validatedJWTPayload;

    if (
      userInfo.email.value &&
      'email' in payload &&
      !IS_EMAIL_UPDATE_ALLOWED
    ) {
      throw new UserUpdateInfoError(
        RESPONSE_CONFIG.ERROR.CLIENT_ERROR_MSGS.EMAIL_NOT_UPDATABLE,
      );
    }

    const filteredPayload: any = { ...payload };

    if ('email' in payload && payload.email === userInfo.email.value) {
      delete filteredPayload.email;
    }
    if ('email' in filteredPayload) {
      filteredPayload.email = {
        value: payload.email,
        lastEmail: userInfo.email.value ? userInfo.email.value : '',
        updatedAt: Date.now(),
        verified: false,
      } as IUser['email'];
    }

    console.log(filteredPayload);
    const docUpdated = await FirebaseInstance.updateDocument<IUser>(
      'users',
      userDocId,
      filteredPayload,
    );

    const { avatar, username } = docUpdated.result;
    return { avatar, username, userDocId };
  }
}
