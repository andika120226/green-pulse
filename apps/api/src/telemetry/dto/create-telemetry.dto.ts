import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTelemetryDto {
  @ApiProperty({ example: 'GP-KHG-01', description: 'Unique LoRaWAN Sensor Node Code' })
  @IsString()
  nodeCode: string;

  @ApiProperty({ example: -64.5, description: 'Peat water table depth TMA in cm' })
  @IsNumber()
  @Min(-200)
  @Max(50)
  waterLevelTMA: number;

  @ApiProperty({ example: 28.4, description: 'Soil moisture at 10cm depth (%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  soilMoisture10cm: number;

  @ApiPropertyOptional({ example: 39.2, description: 'Soil moisture at 40cm depth (%)' })
  @IsOptional()
  @IsNumber()
  soilMoisture40cm?: number;

  @ApiProperty({ example: 38.6, description: 'Peat surface temperature (°C)' })
  @IsNumber()
  @Min(10)
  @Max(90)
  surfaceTemp: number;

  @ApiPropertyOptional({ example: 35.8, description: 'Ambient air temperature (°C)' })
  @IsOptional()
  @IsNumber()
  airTemp?: number;

  @ApiPropertyOptional({ example: 46.0, description: 'Ambient air humidity (%)' })
  @IsOptional()
  @IsNumber()
  airHumidity?: number;

  @ApiPropertyOptional({ example: 168.0, description: 'Particulate matter PM2.5 (ug/m3)' })
  @IsOptional()
  @IsNumber()
  pm25?: number;

  @ApiPropertyOptional({ example: 14, description: 'Consecutive dry days without rain' })
  @IsOptional()
  @IsNumber()
  consecutiveDryDays?: number;

  @ApiPropertyOptional({ example: -74, description: 'LoRaWAN RSSI signal strength (dBm)' })
  @IsOptional()
  @IsNumber()
  rssiDbm?: number;

  @ApiPropertyOptional({ example: 89.4, description: 'LiFePO4 solar battery level (%)' })
  @IsOptional()
  @IsNumber()
  batteryPercent?: number;

  @ApiPropertyOptional({ description: 'HMAC-SHA256 payload signature' })
  @IsOptional()
  @IsString()
  payloadSignature?: string;
}

