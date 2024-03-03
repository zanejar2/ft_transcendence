/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { v4 as uid } from 'uuid';
import { Socket, Server } from 'socket.io';
import {
  HCANVAS,
  Room,
  WCANVAS,
  BallH,
  PlayerHeight,
  PlayerWidth,
} from './class/room.class';
import { HistoryService } from './history.service';

@Injectable()
export class GameService {
  private room: Map<string, Room>;
  private id: string;

  private Players = new Map<string, any[]>();

  constructor() {
    this.id = uid();
    this.room = new Map<string, Room>();
  }

  isInGame(client : Socket): boolean
  {

    if (this.Players.get(client.id))
      return (true);
    return (false);
  }


  LeaveRoom(client: Socket, server: Server, historyService: HistoryService) {
    
    const rid = this.Players.get(client.id);

    if (rid != undefined) {
      const room = this.room.get(rid[0]);

      if (room && room.isLaunched == true) {
        if (room.GameMode != 'Practice' && room.GameMode != 'Practice-Reflex') {
          server.to(rid[0]).emit('GameState', 'Disconnect');

          const WinnerId =
            room.P1.id == client.id
              ? this.Players.get(room.P2.id)
              : this.Players.get(room.P1.id);
          const WinnerState = room.P1.id == client.id ? room.P2 : room.P1;
          const LoserState = room.P1.id == client.id ? room.P1 : room.P2;

          // Create a Match History for the Disconnected Player
          historyService.Create(
            rid[1],
            WinnerId[1],
            rid[1],
            WinnerState,
            LoserState,
            'Disconnect',
          );

          // Create a Match History for the Winner
          historyService.Create(
            WinnerId[1],
            WinnerId[1],
            rid[1],
            WinnerState,
            LoserState,
            'Disconnect',
          );
        } else {
          const PlayerId = this.Players.get(room.P1.id);

          historyService.Create(
            PlayerId[1],
            0,
            PlayerId[1],
            room.P2,
            room.P1,
            'Practice',
          );
        }
      }
      else if (room)
      {
        const PlayerId = this.Players.get(room.P1.id);

          historyService.Create(
            PlayerId[1],
            0,
            PlayerId[1],
            room.P2,
            room.P1,
            'out',
          );
      }

      client.leave(rid[0]);

      this.room.delete(rid[0]);
      this.Players.delete(client.id);
    }
  }

  resizeScreen(client: Socket, data) {
    const rid = this.Players.get(client.id);

    if (rid) {
      const room = this.room.get(rid[0]);
      if (room.P1.id == client.id) {
        room.P1.hCanvas = data.hCanvas;
        room.P1.wCanvas = data.wCanvas;
        room.P2.hCanvas = data.hCanvas;
        room.P2.wCanvas = data.wCanvas;



        return {
          id: room.P1.id,
          y: room.P2.y,
          normilizeY: (room.P1.y / HCANVAS) * room.P1.hCanvas,
        };
      } else if (room.P2.id == client.id) {

        room.P2.hCanvas = data.hCanvas;
        room.P2.wCanvas = data.wCanvas;

        return {
          id: room.P2.id,
          y: (room.P1.y / HCANVAS) * data.hCanvas,
          normilizeY: (room.P2.y / HCANVAS) * room.P2.hCanvas,
        };
      }
    }
  }

  CreatePracticeRoom(
    client: Socket,
    PlayerData: any,
    PlayerName: string,
    PlayerId: number,
  ) {
    const id = uid();

    this.room.set(
      id,
      new Room(
        client.id,
        '',
        PlayerName,
        'Bot',
        PlayerData.hCanvas,
        PlayerData.wCanvas,
        PlayerData.hCanvas,
        PlayerData.wCanvas,
        PlayerData.GameMode,
      ),
    );

    const room = this.room.get(id);

    room.Join('', PlayerData, 'Bot');

    client.join(id);

    this.Players.set(client.id, [id, PlayerId]);

    return { id: id, room: room };
  }

  JoinReqeustedRoom(
    client: Socket,
    PlayerData: any,
    PlayerName: string,
    PlayerId: number,
    RequestGameToken: string,
  ) {
    let JoinedRoom: any = null;

    const room = this.room.get(RequestGameToken);

    // if the room is created
    if (room) {
      room.Join(client.id, PlayerData, PlayerName);
      client.join(RequestGameToken);
      JoinedRoom = { id: RequestGameToken, room: room };
      this.Players.set(client.id, [RequestGameToken, PlayerId]);
      return JoinedRoom;
    } else {
      this.room.set(
        RequestGameToken,
        new Room(
          client.id,
          '',
          PlayerName,
          '',
          PlayerData.hCanvas,
          PlayerData.wCanvas,
          0,
          0,
          PlayerData.GameMode,
        ),
      );

      client.join(RequestGameToken);
      this.Players.set(client.id, [RequestGameToken, PlayerId]);
      return { id: RequestGameToken, room: this.room.get(RequestGameToken) };
    }
  }

  JoinRoom(
    client: Socket,
    PlayerData: any,
    PlayerName: string,
    PlayerId: number,
  ) {
    let JoinedRoom: any = null;

    this.id = uid(); // Generate Unique Room id

    // if the map is empty insert new node
    if (this.room.size == 0) {
      this.room.set(
        this.id,
        new Room(
          client.id,
          '',
          PlayerName,
          '',
          PlayerData.hCanvas,
          PlayerData.wCanvas,
          0,
          0,
          PlayerData.GameMode,
        ),
      );

      client.join(this.id);
      this.Players.set(client.id, [this.id, PlayerId]);
      return { id: this.id, room: this.room.get(this.id) };
    }

    // Check if there is any player waiting inside a Room
    this.room.forEach((room, id) => {
      if (room.PlayerJoined <= 1 && room.GameMode == PlayerData.GameMode) {
        room.Join(client.id, PlayerData, PlayerName);

        client.join(id);

        JoinedRoom = { id: id, room: room };
        this.Players.set(client.id, [id, PlayerId]);
      }
    });

    // Player Found an Opponent
    if (JoinedRoom != null) return JoinedRoom;

    // Insert new room with the newly connected player
    this.room.set(
      this.id,
      new Room(
        client.id,
        '',
        PlayerName,
        '',
        PlayerData.hCanvas,
        PlayerData.wCanvas,
        0,
        0,
        PlayerData.GameMode,
      ),
    );

    client.join(this.id);
    this.Players.set(client.id, [this.id, PlayerId]);
    return { id: this.id, room: this.room.get(this.id) };
  }

  updatePlayer(PlayerId: String, data: any) {
    // update Player position and send the new position to other Player.
    let room = this.room.get(data.RoomId);

    if (room.GameMode == 'Practice' || room.GameMode == 'Practice-Reflex') {
      room.P1.y = data.y;
      return null;
    } else {
      if (room.P1.id == PlayerId) {
        room.P1.y = data.y;

        return { id: room.P2.id, hCanvas: room.P2.hCanvas };
      } else {
        room.P2.y = data.y;

        return { id: room.P1.id, hCanvas: room.P1.hCanvas };
      }
    }
  }

  updateBall(server: Server, historyService: HistoryService) {
    // Update the Ball in Every Launched Room
    this.room.forEach((room, id) => {
      if (room.isLaunched) {
        server.to(room.P1.id).emit('LoadBoard', {
          P1Name: room.P1.name,
          P2Name: room.P2.name,
        });

        //Update P2 Board

        if (room.GameMode != 'Practice' && room.GameMode != 'Practice-Reflex')
          server.to(room.P2.id).emit('LoadBoard', {
            P1Name: room.P2.name,
            P2Name: room.P1.name,
          });

        room.Ball.x += room.Ball.velocityX;
        room.Ball.y += room.Ball.velocityY;
        room.RevBall.x += room.RevBall.velocityX;
        room.RevBall.y += room.RevBall.velocityY;

        // Update Bot Position
        if (room.GameMode == 'Practice' || room.GameMode == 'Practice-Reflex') {
          room.P2.y += (room.Ball.y - (room.P2.y + PlayerHeight / 2)) * 0.09;

          server.to(room.P1.id).emit('UpdatePlayer', {
            y: (room.P2.y / HCANVAS) * room.P2.hCanvas,
          });
        }

        let Player = room.Ball.x > WCANVAS / 2 ? room.P2 : room.P1;

        // Check Collision
        if (collision(room.Ball, Player)) {
          let collidePoint = room.Ball.y - (Player.y + PlayerHeight / 2);

          collidePoint = collidePoint / (PlayerHeight / 2);

          let angelRad = (Math.PI / 4) * collidePoint;

          let direction = room.Ball.x < WCANVAS / 2 ? 1 : -1;

          room.Ball.velocityX =
            direction * room.Ball.speed * Math.cos(angelRad);
          room.Ball.velocityY = room.Ball.speed * Math.sin(angelRad);

          room.RevBall.velocityX = -room.Ball.velocityX;
          room.RevBall.velocityY = room.Ball.velocityY;

          // Reflex Mode
          if (room.GameMode == 'Reflex' || room.GameMode == 'Practice-Reflex') {
            const getRandomNumber = (min = 0, max = 100) => {
              // find diff
              let difference = max - min;

              // generate random number
              let rand = Math.random();

              // multiply with difference
              rand = Math.floor(rand * difference);

              // add with min value
              rand = rand + min;

              return rand;
            };

            const randomSpeed = getRandomNumber(3, 12);
            room.Ball.speed = randomSpeed;
            room.RevBall.speed = randomSpeed;
          } else {
            room.Ball.speed += 0.2;
            room.RevBall.speed += 0.2;
          }
        }

        // Check Collision With The Canvas Top and Bottom
        if (room.Ball.y + BallH > HCANVAS || room.Ball.y < 0) {
          room.Ball.velocityY *= -1;
          room.RevBall.velocityY *= -1;
        }

        // P2 Score a Point
        if (room.Ball.x < 0) {
          room.P2.score++;
          // send New Score To P1
          server.to(room.P1.id).emit('UpdateBoard', {
            Score: {
              P1: room.P1.score,
              P2: room.P2.score,
            },
          });

          // send New Score To P2
          if (room.GameMode != 'Practice' && room.GameMode != 'Practice-Reflex')
            server.to(room.P2.id).emit('UpdateBoard', {
              Score: {
                P1: room.P2.score,
                P2: room.P1.score,
              },
            });

          // Reset Ball
          const UpdateBall = reset(room.Ball, room.RevBall);
          room.Ball = UpdateBall.Ball;
          room.RevBall = UpdateBall.RevBall;
        } else if (room.Ball.x + BallH > WCANVAS) {
          // P1 Score a Point
          room.P1.score++;
          server.to(room.P1.id).emit('UpdateBoard', {
            Score: {
              P1: room.P1.score,
              P2: room.P2.score,
            },
          });

          if (room.GameMode != 'Practice' && room.GameMode != 'Practice-Reflex')
            server.to(room.P2.id).emit('UpdateBoard', {
              Score: {
                P1: room.P2.score,
                P2: room.P1.score,
              },
            });

          // Reset Ball
          const UpdateBall = reset(room.Ball, room.RevBall);
          room.Ball = UpdateBall.Ball;
          room.RevBall = UpdateBall.RevBall;
        }

        // Game End
        if (room.P1.score == 7) {
          server.to(room.P1.id).emit('GameState', 'Win');
          if (room.GameMode != 'Practice' && room.GameMode != 'Practice-Reflex')
            server.to(room.P2.id).emit('GameState', 'Lost');
          room.isLaunched = false;

          // Add Match to History
          const P1Data = this.Players.get(room.P1.id);
          const P2Data = this.Players.get(room.P2.id);

          // Add P1 History
          if (P2Data)
          {
            historyService.Create(
              P1Data[1],
              P1Data[1],
              P2Data[1],
              room.P1,
              room.P2,
              'Normal',
            );
          }
          else
          {
            historyService.Create(
              P1Data[1],
              P1Data[1],
              0,
              room.P1,
              room.P2,
              'Practice',
            );
          }
          // Add P2 History
          if (room.GameMode != 'Practice' && room.GameMode != 'Practice-Reflex')
            historyService.Create(
              P2Data[1],
              P1Data[1],
              P2Data[1],
              room.P1,
              room.P2,
              'Normal',
            );
        } else if (room.P2.score == 7) {
          server.to(room.P1.id).emit('GameState', 'Lost');
          if (room.GameMode != 'Practice' && room.GameMode != 'Practice-Reflex')
            server.to(room.P2.id).emit('GameState', 'Win');
          room.isLaunched = false;

          // Add Match to History
          const P1Data = this.Players.get(room.P1.id);
          const P2Data = this.Players.get(room.P2.id);

          if (
            room.GameMode == 'Practice' ||
            room.GameMode == 'Practice-Reflex'
          ) {
            // Add P1 History
            historyService.Create(
              P1Data[1],
              0,
              P1Data[1],
              room.P2,
              room.P1,
              'Practice',
            );
          } else {
            // Add P1 History
            historyService.Create(
              P1Data[1],
              P2Data[1],
              P1Data[1],
              room.P2,
              room.P1,
              'Normal',
            );

            // Add P2 History
            historyService.Create(
              P2Data[1],
              P2Data[1],
              P1Data[1],
              room.P2,
              room.P1,
              'Normal',
            );
          }
        }

        // Normalize Ball to P1 Size
        const sBall = {
          x: (room.Ball.x / WCANVAS) * room.P1.wCanvas,
          y: (room.Ball.y / HCANVAS) * room.P1.hCanvas,
        };

        // Normalize Ball to P2 Size
        const sRevBall = {
          x: (room.RevBall.x / WCANVAS) * room.P2.wCanvas,
          y: (room.RevBall.y / HCANVAS) * room.P2.hCanvas,
        };

        server.to(room.P1.id).emit('UpdateBall', sBall);
        if (room.GameMode != 'Practice' && room.GameMode != 'Practice-Reflex')
          server.to(room.P2.id).emit('UpdateBall', sRevBall);
      }
    });

    // Check the collision Between the Ball and the Player
    function collision(ball, player) {
      const Ball = {
        top: ball.y,
        bottom: ball.y + BallH,
        left: ball.x,
        right: ball.x + BallH,
      };

      const Player = {
        top: player.y,
        bottom: player.y + PlayerHeight,
        left: player.x,
        right: player.x + PlayerWidth,
      };

      return (
        Ball.right > Player.left &&
        Ball.top < Player.bottom &&
        Ball.left < Player.right &&
        Ball.bottom > Player.top
      );
    }

    // Reset Ball Position
    function reset(Ball, revBall) {
      Ball.x = WCANVAS / 2;
      Ball.y = HCANVAS / 2;
      Ball.velocityX = -((Ball.velocityX / Ball.speed) * 2);
      Ball.velocityY = (Ball.velocityY / Ball.speed) * 2;
      Ball.speed = 2;

      revBall = { ...Ball };
      revBall.velocityX = -revBall.velocityX;
      revBall.x -= BallH;

      return { Ball: Ball, RevBall: revBall };
    }
  }
}
