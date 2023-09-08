import FirebaseService from '../services/FirebaseService';

const checkIfUserAlreadyExistsByDocId = async (userDocId: string) => {
  const userExists = await FirebaseService.getDocumentRef('users', userDocId);
  return userExists;
};

export default checkIfUserAlreadyExistsByDocId;
