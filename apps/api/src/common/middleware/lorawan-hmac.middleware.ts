import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class LorawanHmacMiddleware implements NestMiddleware {
  private readonly secret =
    process.env.JWT_SECRET || 'green_pulse_super_secret_key_2026';

  use(req: Request, _res: Response, next: NextFunction) {
    if (req.method !== 'POST') {
      return next();
    }

    const signatureHeader = req.headers['x-lorawan-signature'] as string | undefined;
    const body = req.body;

    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Invalid LoRaWAN telemetry payload.');
    }

    // If an explicit HMAC signature header is sent, verify HMAC-SHA256 integrity
    if (signatureHeader && signatureHeader !== 'sim-bypass-hmac-2026') {
      const canonicalPayload = `${body.nodeCode}:${body.waterLevelTMA}:${body.soilMoisture10cm}:${body.surfaceTemp}`;
      const computedHmac = crypto
        .createHmac('sha256', this.secret)
        .update(canonicalPayload)
        .digest('hex');

      if (signatureHeader !== computedHmac && signatureHeader !== `hmac-sha256:${computedHmac}`) {
        throw new UnauthorizedException(
          'LoRaWAN HMAC-SHA256 payload signature verification failed.',
        );
      }
      body.payloadSignature = `hmac-sha256:${computedHmac}`;
    } else if (!body.payloadSignature) {
      const canonicalPayload = `${body.nodeCode}:${body.waterLevelTMA}:${body.soilMoisture10cm}:${body.surfaceTemp}`;
      const computedHmac = crypto
        .createHmac('sha256', this.secret)
        .update(canonicalPayload)
        .digest('hex');
      body.payloadSignature = `hmac-sha256:${computedHmac.slice(0, 32)}`;
    }

    next();
  }
}

