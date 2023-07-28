import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Put,
  UseBefore,
} from 'routing-controllers';
import UsersServices from './UsersServices';
import authenticationMiddleware from 'middlewares/authenticationMiddleware';
import { IUsersData } from './UsersTypes';

@JsonController('/Users')
export default class Users {
  public services = new UsersServices();

  @Get()
  @UseBefore(authenticationMiddleware(true))
  async getUsers() {
    return this.services.getAllUsers();
  }

  @Put()
  @UseBefore(authenticationMiddleware(true))
  async getUserData(@Body() body: IUsersData) {
    return this.services.updateUser(body);
  }

  @Delete('/:id')
  @UseBefore(authenticationMiddleware(true))
  async getDeleteUser(@Param('id') id: string) {
    return this.services.deleteUser(id);
  }
}
