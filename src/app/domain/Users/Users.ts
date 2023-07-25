import { Get, JsonController } from 'routing-controllers';
import UsersServices from './UsersServices';

@JsonController('/Users')
export default class Users {
  public services = new UsersServices();

  @Get()
  async getUsers() {
    return this.services.getAllUsers();
  }
}
