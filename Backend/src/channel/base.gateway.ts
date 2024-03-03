import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/Chat'
})

export class BaseGateway {
  @WebSocketServer() protected server: Server;
  constructor() {}
}
