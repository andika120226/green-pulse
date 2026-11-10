import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ReportSeverityDto {
  ASAP_TIPIS = 'ASAP_TIPIS',
  ASAP_PEKAT_GAMBUT = 'ASAP_PEKAT_GAMBUT',
  API_TERBUKA = 'API_TERBUKA',
}

export class CreateReportDto {
  @ApiProperty({ example: 'Ahmad Syafii (MPA Pulau Padang)' })
  @IsString()
  reporterName: string;

  @ApiProperty({ example: '+6285271993812' })
  @IsString()
  reporterPhone: string;

  @ApiProperty({ example: 'Sektor Desa Pulau Padang Utara (Blok A1)' })
  @IsString()
  sector: string;

  @ApiProperty({
    example:
      'Kepulan asap putih pekat berbau gambut menyengat muncul dari bawah permukaan dekat sekat kanal kering.',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 0.2586, description: 'GPS Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 102.4035, description: 'GPS Longitude' })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 3.2 })
  @IsOptional()
  @IsNumber()
  gpsAccuracyMeters?: number;

  @ApiPropertyOptional({ example: '/images/peat-smoke-sample-1.jpg' })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  exifVerified?: boolean;

  @ApiProperty({ example: false, description: 'Anti-Mock GPS verification flag' })
  @IsBoolean()
  isMockLocation: boolean;

  @ApiProperty({ enum: ReportSeverityDto, example: ReportSeverityDto.ASAP_PEKAT_GAMBUT })
  @IsEnum(ReportSeverityDto)
  severity: ReportSeverityDto;
}

