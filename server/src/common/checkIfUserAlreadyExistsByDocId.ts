import { FirebaseInstance } from '..';

const checkIfUserAlreadyExistsByDocId = async (userDocId: string) => {
  const userExists = await FirebaseInstance.getDocumentRef('users', userDocId);
  return userExists;
};

export default checkIfUserAlreadyExistsByDocId;
