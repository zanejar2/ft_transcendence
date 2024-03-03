/* eslint-disable prettier/prettier */
import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService }    from './game.service';
import { Server, Socket } from 'socket.io';
import { Interval }       from '@nestjs/schedule';
import { HCANVAS, WCANVAS } from './class/room.class';
import { decode } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { HistoryService } from './history.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  namespace :"/game",
  cors : {
      origin : `http://${process.env.URI}` , 
      credentials: true , transports : 'websocket'
    },
    pingInterval: 5000,
    pingTimeout: 5000,
  })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer()
  server: Server;
  
  constructor(
    private readonly gameService: GameService,
    private readonly jwt : JwtService,
    private readonly historyService: HistoryService,
    private readonly prismaService: PrismaService,
    ){ }

  afterInit(server: any) {
  
    console.log('server listening on port 3000');  
  
  }
  
  async DecodeCookie(cookie:string)
  {

    if (cookie) {
      const jwt = cookie.split('=')[1];
      const t = decode(jwt);

      if (cookie && jwt) {
        try{
          const user = await this.jwt.verifyAsync(jwt,{secret:'secretykuiykuy'});
          return user;
        }catch(err){
          return null; 
        }
      }
    }
    return null;
  }

  handleConnection(client: Socket) {
    
    client.on('JoinRoom', async (data) => {

        const payload = await this.DecodeCookie(client.handshake.headers.cookie);
      
        // find the user
        const User = await this.prismaService.user.findUnique({
          where: {
            email: payload.email,
          },
        });

        // if the user is logged in
        if (User && !User.inGame)
        {

          // set player in-game
          await this.prismaService.user.update({
            where: { id: User.id },
            data: {
              inGame: true
            },
          });

          let JoinedRoom:any;
          
          // if the player accept game invite
          if (User.requestGameToken)
            JoinedRoom = this.gameService.JoinReqeustedRoom(client, data, User.login, User.id, User.requestGameToken);
          else if (data.GameMode == 'Practice' || data.GameMode == 'Practice-Reflex') // Player VS Boot
            JoinedRoom = this.gameService.CreatePracticeRoom(client, data, User.login, User.id);
          else // Player VS Random Player
            JoinedRoom = this.gameService.JoinRoom(client, data, User.login, User.id);
          
          if (JoinedRoom && JoinedRoom.room.isLaunched){
            // Send ticket room to players
            this.server.to(JoinedRoom.id).emit('GameStarted', { RoomId: JoinedRoom.id});

            //Update P1 Board
            this.server.to(JoinedRoom.room.P1.id).emit('LoadBoard', {
              P1Name: JoinedRoom.room.P1.name,
              P2Name: JoinedRoom.room.P2.name,
            })
            
            //Update P2 Board
            if (data.GameMode != 'Practice' && data.GameMode != 'Practice-Reflex')
              this.server.to(JoinedRoom.room.P2.id).emit('LoadBoard', {
                P1Name: JoinedRoom.room.P2.name,
                P2Name: JoinedRoom.room.P1.name,
              })

          }
      }
    });
  }

  @SubscribeMessage('leaveGame')
  leaveGame(@ConnectedSocket() client : Socket)
  {

    this.gameService.LeaveRoom(client, this.server, this.historyService);
  }

  
  @SubscribeMessage('isInGame')
  isInGame(@ConnectedSocket() client : Socket)
  {
    if (this.gameService.isInGame(client))
    {

      this.gameService.LeaveRoom(client, this.server, this.historyService);

    }

  }


  async handleDisconnect(client: any) {
    
    this.gameService.LeaveRoom(client, this.server, this.historyService);

  }

  @SubscribeMessage('updatePlayer')
  updatePlayer(@MessageBody() data , @ConnectedSocket() client : Socket)
  {
    const Data = this.gameService.updatePlayer(client.id, data);
    if (Data)
    {
      const newY = (data.y / HCANVAS) * Data.hCanvas;

      this.server.to(Data.id).emit('UpdatePlayer', {
            y: newY
        }
      );
    }
  }

  @SubscribeMessage('resizeScreen')
  resizeScreen(@MessageBody() data , @ConnectedSocket() client : Socket)
  {
    const NewPlayerY = this.gameService.resizeScreen(client, data);

    this.server.to(NewPlayerY.id).emit('UpdatePlayer', {y: NewPlayerY.y, normilizeY: NewPlayerY.normilizeY})
  }

  @Interval(10)
  updateBall()
  {
    
    this.gameService.updateBall(this.server, this.historyService);
    
  }

}