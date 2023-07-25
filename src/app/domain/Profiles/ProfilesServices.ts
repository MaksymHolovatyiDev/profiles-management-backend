import { Types } from 'mongoose';
import { Profile } from 'models/profiles';
import { IProfiles } from './ProfilesTypes';
import tokenVerification from 'helpers/tokenVerification';

export class ProfilesServices {
  async getAllProfiles(token: string) {
    console.log(token);
    try {
      return await Profile.find().lean().select('name gender birthdate city');
    } catch (e) {
      return e;
    }
  }

  async addUserProfile(token: string, body: IProfiles) {
    const { name, gender, birthdate, city } = body;
    try {
      const id = await tokenVerification(token);
      const { _id }: any = await Profile.create({
        name,
        gender,
        birthdate,
        city,
        user: id,
      });

      return _id;
    } catch (e) {
      return e;
    }
  }

  // async editUserProfile(body: IProfiles) {
  //   const {
  //     id,
  //     data: { name, gender, birthdate, city },
  //   } = body;

  //   try {
  //     await Profile.findByIdAndUpdate(
  //       { _id: id },
  //       { name, gender, birthdate, city }
  //     );

  //     return 'Profile updated!';
  //   } catch (e) {
  //     return e;
  //   }
  // }

  async deleteUserProfile(id: Types.ObjectId) {
    try {
      return await Profile.findByIdAndDelete(id);
    } catch (e) {
      return e;
    }
  }
}
