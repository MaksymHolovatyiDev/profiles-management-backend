import { isValidObjectId } from 'mongoose';
import { BadRequestError, ForbiddenError } from 'routing-controllers';

import { User } from 'models/user';
import { Profile } from 'models/profiles';
import { IProfiles } from './ProfilesTypes';

export class ProfilesServices {
  async getAllProfiles(tokenId: string, userId: string) {
    try {
      await this.isCorrectUser(tokenId, userId);

      return await Profile.find({ user: userId })
        .select({
          _id: { $toString: '$_id' },
          name: 1,
          gender: 1,
          birthdate: 1,
          city: 1,
        })
        .lean();
    } catch (e) {
      throw e;
    }
  }

  async addUserProfile(tokenId: string, body: IProfiles) {
    const {
      userId,
      data: { name, gender, birthdate, city },
    } = body;

    try {
      await this.isCorrectUser(tokenId, userId);

      const { _id }: any = await Profile.create({
        name,
        gender,
        birthdate,
        city,
        user: userId,
      });

      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { profiles: _id } }
      );

      return await Profile.findById(_id)
        .select({
          _id: { $toString: '$_id' },
          name: 1,
          gender: 1,
          birthdate: 1,
          city: 1,
        })
        .lean();
    } catch (e) {
      throw e;
    }
  }

  async editUserProfile(tokenId: string, _id: string, body: IProfiles) {
    const {
      userId,
      data: { name, gender, birthdate, city },
    } = body;

    try {
      if (!isValidObjectId(userId || !isValidObjectId(_id))) {
        throw new BadRequestError('Invalid id!');
      }

      const user = await User.findById(tokenId);

      if (!user || (userId !== tokenId && !user?.admin))
        throw new ForbiddenError('Access denied!');

      const userProfile = await Profile.findById(_id);

      if (
        !userProfile ||
        (userProfile.user.toString() !== userId && !user.admin)
      )
        throw new BadRequestError('Incorrect user!');

      return await Profile.findByIdAndUpdate(
        { _id },
        { name, gender, birthdate, city },
        { new: true }
      )
        .lean()
        .select({
          _id: { $toString: '$_id' },
          name: 1,
          gender: 1,
          birthdate: 1,
          city: 1,
        });
    } catch (e) {
      throw e;
    }
  }

  async deleteUserProfile(tokenId: string, id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestError('Invalid id!');
      }

      const profileData = await Profile.findById(id);

      if (!profileData) throw new BadRequestError('Incorrect profile id!');

      if (profileData.user.toString() !== tokenId) {
        const userData = await User.findById(tokenId);
        if (userData && !userData.admin) {
          throw new ForbiddenError('Access denied!');
        }
      }

      await User.findOneAndUpdate(
        { profiles: id },
        { $pull: { profiles: id } }
      );

      return await Profile.findByIdAndDelete(id)
        .lean()
        .select({
          _id: { $toString: '$_id' },
        });
    } catch (e) {
      throw e;
    }
  }

  async isCorrectUser(tokenId: string, userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestError('Invalid id!');
    }
    if (userId !== tokenId) {
      const user = await User.findById(tokenId);
      if (!user?.admin) {
        throw new ForbiddenError('Access denied!');
      }
    }
  }
}
