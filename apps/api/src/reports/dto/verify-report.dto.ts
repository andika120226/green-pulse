import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VerifyReportDto {
  @ApiProperty({
    example: 'DISPATCHED',
    description: 'VERIFIED | DISPATCHED | RESOLVED | REJECTED',
  })
  @IsString()
  status: 'PENDING' | 'VERIFIED' | 'DISPATCHED' | 'RESOLVED' | 'REJECTED';

  @ApiPropertyOptional({
    example: 'Regu Manggala Agni Alpha-01 & MPA Merbau',
  })
  @IsOptional()
  @IsString()
  dispatchedTeam?: string;

  @ApiPropertyOptional({
    example: 'Komandan Posko BPBD Riau',
  })
  @IsOptional()
  @IsString()
  verifiedBy?: string;
}

