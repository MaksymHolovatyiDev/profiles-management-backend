import { Profile } from 'models/profiles';
import { User } from 'models/user';

export default class DashboardServices {
  async getFullData() {
    const users = await User.estimatedDocumentCount();
    const profiles = await Profile.estimatedDocumentCount();

    const eighteenYearsOld = new Date();
    eighteenYearsOld.setFullYear(eighteenYearsOld.getFullYear() - 18);
    const adult = await Profile.find({
      birthdate: { $lte: eighteenYearsOld },
    }).count();

    return { users, profiles, adult };
  }
}
