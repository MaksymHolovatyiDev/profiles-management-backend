import { Get, JsonController, Param, UseBefore } from 'routing-controllers';
import UsersServices from './UsersServices';
import authenticationMiddleware from 'middlewares/authenticationMiddleware';

@JsonController('/Users')
export default class Users {
  public services = new UsersServices();

  @Get()
  @UseBefore(authenticationMiddleware(true))
  async getUsers() {
    return this.services.getAllUsers();
  }

  @Get('/:id')
  @UseBefore(authenticationMiddleware(true))
  async getUserData(@Param('id') id: string) {
    return this.services.getFullUserData(id);
  }
}
