import { Profile } from 'models/profiles';
import { User } from 'models/user';

export default class DashboardServices {
  async getFullData() {
    const users = await User.estimatedDocumentCount();
    const profiles = await Profile.estimatedDocumentCount();

    const adult = await Profile.find({
      birthdate: { $lte: 568024668000 },
    }).count();
    return { users, profiles, adult };
  }
}
