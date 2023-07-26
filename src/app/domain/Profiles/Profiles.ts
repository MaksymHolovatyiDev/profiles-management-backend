import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Patch,
  Post,
  Res,
  UseBefore,
} from 'routing-controllers';
import { ProfilesServices } from './ProfilesServices';
import { IProfiles } from './ProfilesTypes';
import authenticationMiddleware from 'middlewares/authenticationMiddleware';

@JsonController('/Profiles')
export default class Profiles {
  public service = new ProfilesServices();

  @Get('/:id')
  @UseBefore(authenticationMiddleware())
  async getProfiles(@Param('id') id: string, @Res() res: any) {
    console.log(res.userTokenId);
    return this.service.getAllProfiles(res.userTokenId, id);
  }

  @HttpCode(201)
  @Post()
  @UseBefore(authenticationMiddleware())
  async addProfile(@Body() body: IProfiles, @Res() res: any) {
    return this.service.addUserProfile(res.userTokenId, body);
  }

  @Patch('/:id')
  @UseBefore(authenticationMiddleware())
  async editProfile(
    @Param('id') id: string,
    @Body() body: IProfiles,
    @Res() res: any
  ) {
    return this.service.editUserProfile(res.userTokenId, id, body);
  }

  @Delete('/:id')
  @UseBefore(authenticationMiddleware())
  async deleteProfile(@Param('id') id: string, @Res() res: any) {
    return this.service.deleteUserProfile(res.userTokenId, id);
  }
}
