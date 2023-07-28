import { Profile } from 'models/profiles';
import { User } from 'models/user';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from 'routing-controllers';
import { IUsersData } from './UsersTypes';

export default class UsersServices {
  async getAllUsers() {
    try {
      return await User.aggregate().project({
        _id: { $toString: '$_id' },
        name: 1,
        email: 1,
        admin: 1,
        profiles: { $size: '$profiles' },
      });
    } catch (e) {
      throw e;
    }
  }

  async updateUser(body: IUsersData) {
    const { _id, role, name, email } = body;
    try {
      return await User.findByIdAndUpdate(
        { _id },
        { name, email, admin: role !== 'admin' },
        { new: true }
      )
        .lean()
        .select('_id name email admin');
    } catch (e) {
      throw e;
    }
  }

  async deleteUser(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestError('Invalid id!');
      }

      const user = await User.findById(id).populate('profiles', '_id');

      if (user?.profiles?.length && user.profiles.length > 0) {
        for (const profile of user.profiles) {
          await Profile.findByIdAndDelete(profile._id);
        }
      }

      await User.findByIdAndDelete(id);

      return 'Deleted!';
    } catch (e) {
      throw e;
    }
  }
}
