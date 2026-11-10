import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GreenPulseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GreenPulseGateway.name);

  afterInit() {
    this.logger.log('GREEN PULSE WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Command Center client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Command Center client disconnected: ${client.id}`);
  }

  emitTelemetryUpdate(payload: Record<string, any>) {
    if (this.server) {
      this.server.emit('telemetry:update', payload);
    }
  }

  emitNewReport(payload: Record<string, any>) {
    if (this.server) {
      this.server.emit('report:new', payload);
    }
  }
}

