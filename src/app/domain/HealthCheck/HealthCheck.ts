import mongoose from 'mongoose';
import {Get, JsonController} from 'routing-controllers';

@JsonController('/HealthCheck')
export default class HealthCheck {
  @Get()
  async HealthCheck() {
    return {
      message: 'Server running!',
      mongooseConnection: mongoose.connection.readyState,
    };
  }
}
