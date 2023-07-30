import {
  UseBefore,
  JsonController,
  HttpCode,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  Res,
  Body,
} from 'routing-controllers';

import { ProfilesServices } from './ProfilesServices';
import { IProfiles } from './ProfilesTypes';
import authenticationMiddleware from 'middlewares/authenticationMiddleware';

@JsonController('/Profiles')
export default class Profiles {
  public service = new ProfilesServices();

  @Get('/:id')
  @UseBefore(authenticationMiddleware())
  async getProfiles(@Res() res: any, @Param('id') id: string) {
    return this.service.getAllProfiles(res.userTokenId, id);
  }

  @HttpCode(201)
  @Post()
  @UseBefore(authenticationMiddleware())
  async addProfile(@Res() res: any, @Body() body: IProfiles) {
    return this.service.addUserProfile(res.userTokenId, body);
  }

  @Patch('/:id')
  @UseBefore(authenticationMiddleware())
  async editProfile(
    @Res() res: any,
    @Param('id') id: string,
    @Body() body: IProfiles
  ) {
    return this.service.editUserProfile(res.userTokenId, id, body);
  }

  @Delete('/:id')
  @UseBefore(authenticationMiddleware())
  async deleteProfile(@Res() res: any, @Param('id') id: string) {
    return this.service.deleteUserProfile(res.userTokenId, id);
  }
}
