import { Module } from '@nestjs/common';
import { CrowdsourcingService } from './crowdsourcing.service';
import { ReportsController } from './reports.controller';
import { GreenPulseGateway } from '../gateway/green-pulse.gateway';

@Module({
  controllers: [ReportsController],
  providers: [CrowdsourcingService, GreenPulseGateway],
  exports: [CrowdsourcingService],
})
export class ReportsModule {}

