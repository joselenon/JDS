import IUser, { IUserControllerGQL } from '../../config/interfaces/IUser';
import FirebaseService from '../../services/FirebaseService';

class UserController implements IUserControllerGQL {
  async getUser(userDocId: string) {
    const userData = await FirebaseService.getDocumentById<IUser>(
      'users',
      userDocId,
    );
    return userData;
  }
}

export default new UserController();
