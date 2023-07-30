import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Patch,
  UseBefore,
} from 'routing-controllers';

import UsersServices from './UsersServices';
import authenticationMiddleware from 'middlewares/authenticationMiddleware';
import { IUser } from 'types/models/user';

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
  async getOneUser(@Param('id') id: string) {
    return this.services.getCurrentUser(id);
  }

  @Patch('/:id')
  @UseBefore(authenticationMiddleware(true))
  async getUserData(
    @Param('id') id: string,
    @Body() body: Pick<IUser, 'name' | 'email' | 'admin'>
  ) {
    return this.services.updateUser(id, body);
  }

  @HttpCode(204)
  @Delete('/:id')
  @UseBefore(authenticationMiddleware(true))
  async getDeleteUser(@Param('id') id: string) {
    return this.services.deleteUser(id);
  }
}
