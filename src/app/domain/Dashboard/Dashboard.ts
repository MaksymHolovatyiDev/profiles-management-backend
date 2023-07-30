import { Get, JsonController, UseBefore } from 'routing-controllers';

import DashboardServices from './DashboardServices';
import authenticationMiddleware from 'middlewares/authenticationMiddleware';

@JsonController('/Dashboard')
export default class Dashboard {
  public service = new DashboardServices();

  @Get()
  @UseBefore(authenticationMiddleware(true))
  async getDashboardData() {
    return this.service.getFullData();
  }
}
