import { isValidObjectId } from 'mongoose';
import { BadRequestError, ForbiddenError } from 'routing-controllers';
import { Profile } from 'models/profiles';
import { User } from 'models/user';
import { IProfiles } from './ProfilesTypes';

export class ProfilesServices {
  async getAllProfiles(tokenId: string, userId: string) {
    try {
      if (userId != tokenId) {
        const { admin }: any = await User.findById(tokenId);
        if (!admin) {
          throw new ForbiddenError('Access denied!');
        }
      }

      return await User.findById(tokenId)
        .lean()
        .select('name gender birthdate city');
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

      return { _id, name, gender, birthdate, city };
    } catch (e) {
      throw e;
    }
  }

  async editUserProfile(tokenId: string, id: string, body: IProfiles) {
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

      if (!isValidObjectId(id)) {
        throw new BadRequestError('Invalid id!');
      }

      await Profile.findByIdAndUpdate(
        { _id: id },
        { name, gender, birthdate, city }
      )
        .lean()
        .select('name gender birthdate city');

      return { message: 'Edited!' };
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
        .select('name gender birthdate city');
    } catch (e) {
      throw e;
    }
  }
}
