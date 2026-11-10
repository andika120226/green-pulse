import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller';
import { RiskInferenceService } from './risk-inference.service';
import { GreenPulseGateway } from '../gateway/green-pulse.gateway';
import { NodesModule } from '../nodes/nodes.module';
import { LorawanHmacMiddleware } from '../common/middleware/lorawan-hmac.middleware';

@Module({
  imports: [NodesModule],
  controllers: [TelemetryController],
  providers: [RiskInferenceService, GreenPulseGateway],
  exports: [RiskInferenceService, GreenPulseGateway],
})
export class TelemetryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LorawanHmacMiddleware).forRoutes(TelemetryController);
  }
}

