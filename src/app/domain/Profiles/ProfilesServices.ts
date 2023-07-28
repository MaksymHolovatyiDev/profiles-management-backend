import { isValidObjectId } from 'mongoose';
import { BadRequestError, ForbiddenError } from 'routing-controllers';
import { Profile } from 'models/profiles';
import { User } from 'models/user';
import { IProfiles, IProfilesID } from './ProfilesTypes';

export class ProfilesServices {
  async getAllProfiles(tokenId: string, userId: string) {
    try {
      if (userId != tokenId) {
        const { admin }: any = await User.findById(tokenId);
        if (!admin) {
          throw new ForbiddenError('Access denied!');
        }
      }

      return await User.findById(userId)
        .lean()
        .populate({
          path: 'profiles',
          select: {
            _id: { $toString: '$_id' },
            name: 1,
            gender: 1,
            birthdate: 1,
            city: 1,
          },
        })
        .select('profiles -_id');
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
      if (userId != tokenId) {
        const { admin }: any = await User.findById(tokenId);
        if (!admin) {
          throw new ForbiddenError('Access denied!');
        }
      }

      const { _id }: any = await Profile.create({
        name,
        gender,
        birthdate,
        city,
      });

      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { profiles: _id } }
      );

      return { _id: _id.toString(), name, gender, birthdate, city };
    } catch (e) {
      throw e;
    }
  }

  async editUserProfile(tokenId: string, data: IProfilesID) {
    const {
      id,
      body: {
        userId,
        data: { name, gender, birthdate, city },
      },
    } = data;
    try {
      if (userId != tokenId) {
        const { admin }: any = await User.findById(tokenId);
        if (!admin) {
          throw new ForbiddenError('Access denied!');
        }
      }

      if (!isValidObjectId(id)) {
        throw new BadRequestError('Invalid id!');
      }

      return await Profile.findByIdAndUpdate(
        { _id: id },
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
      const data: any = await User.findById(tokenId);

      if (!data?.profiles?.includes(id) ?? true) {
        if (!data?.admin ?? true) {
          throw new ForbiddenError('Access denied!');
        }
      }

      if (!isValidObjectId(id)) {
        throw new BadRequestError('Invalid id!');
      }

      await User.findOneAndUpdate(
        { profiles: id },
        { $pull: { profiles: id } }
      );

      return await Profile.findByIdAndDelete(id)
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
}
