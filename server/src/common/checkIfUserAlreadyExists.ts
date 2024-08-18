import { FirebaseInstance } from '..';
import IUser, { IUserJWTPayload } from '../config/interfaces/IUser';

const checkIfUserAlreadyExistsBySteamId = async (
  steamid: string = '',
): Promise<IUserJWTPayload | null> => {
  const userExists = await FirebaseInstance.getSingleDocumentByParam<IUser>(
    'users',
    'steamid',
    steamid,
  );
  if (userExists?.data) {
    const { docId: userDocId } = userExists;
    const { avatar, username } = userExists.data;
    return { avatar, username, userDocId };
  }

  return null;
};

const checkIfUserAlreadyExistsByEmail = async (
  email: string = '',
): Promise<IUserJWTPayload | null> => {
  const userExists = await FirebaseInstance.getSingleDocumentByParam<IUser>(
    'users',
    'email',
    email,
  );
  if (userExists?.data) {
    const { docId: userDocId } = userExists;
    const { avatar, username } = userExists.data;
    return { avatar, username, userDocId };
  }

  return null;
};

// If user is not found in DB, it throw an error (DocumentNotFoundError)
const checkIfUserAlreadyExistsByDocId = async (userDocId: string) => {
  const userExists = await FirebaseInstance.getDocumentRef<
    FirebaseFirestore.DocumentReference,
    IUser
  >('users', userDocId);
  return userExists;
};

export {
  checkIfUserAlreadyExistsBySteamId,
  checkIfUserAlreadyExistsByEmail,
  checkIfUserAlreadyExistsByDocId,
};
