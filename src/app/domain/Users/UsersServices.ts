import { User } from 'models/user';

export default class UsersServices {
  async getAllUsers() {
    return await User.find({}).lean().select('name email');
  }
}
