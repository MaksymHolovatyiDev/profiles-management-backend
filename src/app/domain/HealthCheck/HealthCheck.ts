import {Get, JsonController} from 'routing-controllers';

@JsonController('/HealthCheck')
export default class HealthCheck {
  @Get()
  async HealthCheck() {
    return {
      message: 'Server running!',
    };
  }
}
