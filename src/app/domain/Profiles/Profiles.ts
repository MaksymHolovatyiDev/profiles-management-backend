import {
  Body,
  Delete,
  Get,
  HeaderParam,
  JsonController,
  // Patch,
  Post,
} from 'routing-controllers';
import { ProfilesServices } from './ProfilesServices';
import { IProfiles } from './ProfilesTypes';
import { Types } from 'mongoose';

@JsonController('/Profiles')
export default class Profiles {
  public service = new ProfilesServices();

  @Get()
  async getProfiles(@HeaderParam('authorization') token: string) {
    return this.service.getAllProfiles(token);
  }

  @Post()
  async addProfile(
    @HeaderParam('authorization') token: string,
    @Body() body: IProfiles
  ) {
    return this.service.addUserProfile(token, body);
  }

  // @Patch()
  // async editProfile(@Body() body: IProfiles) {
  //   return this.service.editUserProfile(body);
  // }

  @Delete()
  async deleteProfile(@Body() body: Types.ObjectId) {
    return this.service.deleteUserProfile(body);
  }
}
