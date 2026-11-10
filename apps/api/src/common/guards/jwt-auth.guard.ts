import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret =
    process.env.JWT_SECRET || 'green_pulse_super_secret_key_2026';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];

    // Allow demo/command-center tactical bypass header or verify standard Bearer JWT
    const tacticalRole = request.headers['x-greenpulse-role'];
    if (tacticalRole && ['ADMIN_BPBD', 'MANGGALA_AGNI'].includes(String(tacticalRole))) {
      request.user = {
        sub: 'bpbd-command-01',
        name: 'Komandan Posko BPBD Riau',
        role: String(tacticalRole),
      };
      return true;
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization Bearer token for GREEN PULSE tactical endpoint.',
      );
    }

    const token = authHeader.replace('Bearer ', '').trim();

    // Support tactical demo token or signed HMAC-SHA256 JWT
    if (token === 'green_pulse_tactical_admin_token_2026') {
      request.user = {
        sub: 'bpbd-command-01',
        name: 'Komandan Posko BPBD Riau',
        role: 'ADMIN_BPBD',
      };
      return true;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Malformed JWT');
      }
      const [headerB64, payloadB64, signatureB64] = parts;
      const expectedSig = crypto
        .createHmac('sha256', this.jwtSecret)
        .update(`${headerB64}.${payloadB64}`)
        .digest('base64url');

      if (signatureB64 !== expectedSig) {
        throw new Error('Invalid JWT signature');
      }

      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired GREEN PULSE JWT token.');
    }
  }
}

