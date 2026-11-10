import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';

@ApiTags('LoRaWAN Sensor Nodes (CRUD)')
@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  @ApiOperation({ summary: 'List all LoRaWAN Peatland AIoT Sensor Stations' })
  findAll() {
    return this.nodesService.findAll();
  }

  @Get(':nodeCode')
  @ApiOperation({ summary: 'Get details of a specific LoRaWAN Sensor Station' })
  findOne(@Param('nodeCode') nodeCode: string) {
    return this.nodesService.findOne(nodeCode);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new LoRaWAN Peatland Sensor Station' })
  create(@Body() dto: CreateNodeDto) {
    return this.nodesService.create(dto);
  }

  @Patch(':nodeCode')
  @ApiOperation({ summary: 'Update LoRaWAN Sensor Station metadata or coordinates' })
  update(
    @Param('nodeCode') nodeCode: string,
    @Body() dto: Partial<CreateNodeDto>,
  ) {
    return this.nodesService.update(nodeCode, dto);
  }

  @Delete(':nodeCode')
  @ApiOperation({ summary: 'Remove LoRaWAN Sensor Station' })
  remove(@Param('nodeCode') nodeCode: string) {
    return this.nodesService.remove(nodeCode);
  }
}

