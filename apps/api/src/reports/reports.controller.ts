import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CrowdsourcingService } from './crowdsourcing.service';
import { CreateReportDto } from './dto/create-report.dto';
import { VerifyReportDto } from './dto/verify-report.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Citizen Crowdsourcing & BPBD Dispatch (CRUD)')
@Controller('reports')
export class ReportsController {
  constructor(private readonly crowdsourcingService: CrowdsourcingService) {}

  @Get()
  @ApiOperation({
    summary: 'List all citizen crowdsourced wildfire reports with Haversine/DBSCAN cluster IDs',
  })
  findAll() {
    return this.crowdsourcingService.findAll();
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Submit geotagged citizen wildfire report (validates Anti-Mock GPS & applies 500m/30min Haversine clustering)',
  })
  submitReport(@Body() dto: CreateReportDto) {
    return this.crowdsourcingService.submitReport(dto);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_BPBD', 'MANGGALA_AGNI')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verify citizen report & dispatch Manggala Agni / BPBD wildfire response team',
  })
  verifyReport(@Param('id') id: string, @Body() dto: VerifyReportDto) {
    return this.crowdsourcingService.verifyAndDispatch(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_BPBD', 'MANGGALA_AGNI')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete invalid or resolved report from Command Center' })
  deleteReport(@Param('id') id: string) {
    return this.crowdsourcingService.deleteReport(id);
  }
}

