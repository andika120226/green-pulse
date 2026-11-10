import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNodeDto {
  @ApiProperty({ example: 'GP-KHG-06' })
  @IsString()
  nodeCode: string;

  @ApiProperty({ example: 'Stasiun Restorasi Gambut Desa Bagan Melibur' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'KHG Pulau Padang - Blok E1' })
  @IsString()
  sector: string;

  @ApiProperty({ example: 'Merbau' })
  @IsString()
  district: string;

  @ApiProperty({ example: 0.2912 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 102.4315 })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 490 })
  @IsOptional()
  @IsNumber()
  peatDepthCm?: number;
}

