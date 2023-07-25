import { Get, JsonController } from 'routing-controllers';
import DashboardServices from './DashboardServices';

@JsonController('/Dashboard')
export default class Dashboard {
  public service = new DashboardServices();

  @Get()
  async getDashboardData() {
      return this.service.getFullData();
  }
}
