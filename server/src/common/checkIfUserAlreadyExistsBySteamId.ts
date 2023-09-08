import { IJWTPayload } from '../config/interfaces/IJWT';
import IUser from '../config/interfaces/IUser';
import FirebaseService from '../services/FirebaseService';

const checkIfUserAlreadyExistsBySteamId = async (
  steamid: string = '',
): Promise<IJWTPayload | null> => {
  const userExists = await FirebaseService.getSingleDocumentByParam<IUser>(
    'users',
    'steamid',
    steamid,
  );
  if (userExists) {
    const { docId: userDocId } = userExists;
    const { avatar, username } = userExists.body;
    return { avatar, username, userDocId };
  }

  return null;
};

export default checkIfUserAlreadyExistsBySteamId;
