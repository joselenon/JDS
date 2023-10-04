import { FirebaseInstance } from '..';
import { IJWTPayload } from '../config/interfaces/IJWT';
import IUser from '../config/interfaces/IUser';

const checkIfUserAlreadyExistsBySteamId = async (
  steamid: string = '',
): Promise<IJWTPayload | null> => {
  const userExists = await FirebaseInstance.getSingleDocumentByParam<IUser>(
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
