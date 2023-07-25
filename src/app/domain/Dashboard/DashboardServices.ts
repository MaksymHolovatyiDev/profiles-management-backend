import { User } from 'models/user';

export default class DashboardServices {
  async getFullData() {
    const users = await User.count();
    return { users };
  }
}
