import { isValidObjectId } from 'mongoose';
import { BadRequestError } from 'routing-controllers';

import { User } from 'models/user';
import { IUser } from 'types/models/user';
import { Profile } from 'models/profiles';
import { ISavedUser } from 'types/mainTypes';

export default class UsersServices {
  async getAllUsers() {
    try {
      return await User.aggregate().project({
        _id: { $toString: '$_id' },
        name: 1,
        email: 1,
        profiles: { $size: '$profiles' },
      });
    } catch (e) {
      throw e;
    }
  }

  async getCurrentUser(id: string) {
    try {
      return await User.findById(id).lean().select('_id name email admin');
    } catch (e) {
      throw e;
    }
  }

  async updateUser(_id: string, body: Pick<IUser, 'name' | 'email' | 'admin'>) {
    const { name, email, admin } = body;

    try {
      return await User.findByIdAndUpdate(
        { _id },
        { name, email, admin },
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

      const user: ISavedUser | null = await User.findByIdAndDelete(id);

      if (!user) {
        throw new BadRequestError('User doesn`t exists!');
      }

      if (user && user.profiles.length !== 0)
        await Profile.deleteMany({ user: user._id });

      return '';
    } catch (e) {
      throw e;
    }
  }
}
