import { User } from 'models/user';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from 'routing-controllers';

export default class UsersServices {
  async getAllUsers() {
    try {
      return await User.aggregate().project({
        name: 1,
        email: 1,
        profiles: { $size: '$profiles' },
      });
    } catch (e) {
      throw e;
    }
  }

  async getFullUserData( id: string) {
    try {

      if (!isValidObjectId(id)) {
        throw new BadRequestError('Invalid id!');
      }

      return await User.findById(id)
        .lean()
        .populate('profiles', 'name gender birthdate city')
        .select('name email admin');
    } catch (e) {
      throw e;
    }
  }
}
