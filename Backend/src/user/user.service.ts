/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './dto/user.req.dto';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
// import * as cookie from 'cookie';
// import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { decode } from 'jsonwebtoken';
import { exit } from 'process';
import { use } from 'passport';

export type JwtPayload = {
  id: number;
  exp: number;
  sub: string;
};

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private static clientUserMap = new Map<string, number>();
  private static userSocketMap = new Map<number, string[]>();

  addClientToUser(clientId: string, userId: number) {
    UserService.clientUserMap.set(clientId, userId);
  }

  removeClientFromUser(clientId: string) {
    UserService.clientUserMap.delete(clientId);
  }

  addUserToSocket(userId: number, clientId: string) {
    const sockets = UserService.userSocketMap.get(userId);
    if (sockets) {
      sockets.push(clientId);
      UserService.userSocketMap.set(userId, sockets);
    } 
    else {
      UserService.userSocketMap.set(userId, [clientId]);
    }
  }

  async getUserOfClient(clientId: string) {
    try {
      const theID = UserService.clientUserMap.get(clientId);
      if (theID)
      {
        const user = await this.prisma.user.findUnique({
          where: {
            id: theID,
          },
        });
        return user;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  getAllConnectedUsers() {
    return Array.from(new Set(UserService.clientUserMap.values()));
  }

  getAllSocketsOfUser(userId: number) {
    return UserService.userSocketMap.get(userId);
  }

  async handleDisconnection(client: Socket) {
    const user = await this.getUserOfClient(client.id);
    if (user) {
      this.removeClientFromUser(client.id);
      client.disconnect();
    }
  }

  async ExtractUserIdFromUserCookie(cookie: string) {
    if (cookie) {
      const jwt = cookie.split('=')[1];

      if (cookie && jwt) {
        try {
          const user = await this.jwtService.verifyAsync(jwt, {
            secret: 'secretykuiykuy',
          });
          return user;
        } catch (err) {
          return null;
        }
      }
    }
    return null;
  }

  async handleConnection(client: Socket) {
    try {
      if (
        client &&
        client.handshake &&
        client.handshake.headers &&
        client.handshake.headers.cookie
      ) {
        const user = await this.ExtractUserIdFromUserCookie(
          client.handshake.headers.cookie,
        );
        if (user) {
          const theuser = await this.findUserByemail(user.email);
          if (theuser) {
            const userId = theuser.id;
            this.addClientToUser(client.id, userId);
            this.addUserToSocket(userId, client.id);
          } else {
            this.removeClientFromUser(client.id);
            client.disconnect();
          }
        }
      } else {
        this.removeClientFromUser(client.id);
        client.disconnect();
      }
    } catch (err) {
      this.removeClientFromUser(client.id);
      client.disconnect();
      console.log(err.message);
    }
  }

  async findUserByName(emaill: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: emaill,
        },
      });
      return user;
    } catch (err) {
      console.log(err.message);
    }
  }

  async findUserByemail(emaill: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: emaill,
        },
      });
      return user;
    } catch (err) {
      console.log(err.message);
    }
  }
  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return user;
    } catch (erro) {
      return null;
    }
  }

  async findUsers() {
    try
    {
      const users = await this.prisma.user.findMany({include: {blockedBy: true, blockedUsers: true, friends: true}});
      return users;
    }
    catch (e) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(user: User) {
    try
    {
      const exist = !!(await this.prisma.user.findFirst({
        where: { login: user.login },
      }));
  
      if (!exist) {
          const _user = await this.prisma.user.create({
            data: user,
          });
          return _user;
      }
      else
      {
        const users = await this.prisma.user.findMany();
        const usersLogin = users.map((user) => user.login);
        let i = 1;

        while (usersLogin.includes(`${user.login }${i}`))
          i++;
        user.login = `${user.login}${i}`;
        const _user = await this.prisma.user.create({
          data: user,
        });
        return _user;
      }
        throw new HttpException(`User with the login ${user.login} already exists`, HttpStatus.BAD_REQUEST);  

    }
    catch (e) {
      console.log(e.message);
    }
  }

  async updateState(user: any, state: boolean){
    try {
      const update = await this.prisma.user.update({
        where: { login: user.login },
        data: { isOnline: state },
      })
      if (update)
        return true;
      else 
        throw new Error("state updating failure")
    }
    catch (e) {
      console.log(e.message)
    }
  }

  async updateUser(login: string, user: User) {
    try {
      const usr = await this.prisma.user.findUnique({
				where: {
				  login: login,
				},
			});

      await this.prisma.history.updateMany({
        where: { WinnerId: usr.id },
        data: {
          WinnerName: user.login,
        },
      });


      await this.prisma.history.updateMany({
        where: { LoserId: usr.id },
        data: {
          LoserName: user.login,
        },
      });
      
      const existedUser = !! await this.prisma.user.findUnique({where: {login: user.login}});
      if (existedUser)
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      
      const updatedUser = await this.prisma.user.update({
        where: { login },
        data: user,
      });
      return updatedUser;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }

  async deleteUsers() {
    try
    {
      await this.prisma.user.deleteMany();
    }
    catch
    {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(login: string) {
    try {
      await this.prisma.user.delete({
        where: { login },
      });
    } catch {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
  }

  async creatToken(email: string) {
    const pay = {
      email: email,
    };
    const token = await this.jwtService.signAsync(pay, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return token;
  }

  async isBlocked(user: any, target: any) {
    try {
      const relations = await this.prisma.user.findFirst({
        where: { login: user.login },
        select: { blockedUsers: true, blockedBy: true },
      });
      if (relations) {
        for (const u of relations.blockedUsers) {
          if (u.login === target.login) {
            return true;
          }
        }
        for (const u of relations.blockedBy) {
          if (u.login === target.login) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.log(error.message);
    }
  }


  async addFriend(login: string, friend: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { login } });
      const _friend = await this.prisma.user.findUnique({ where: { login: friend },});
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      if (!_friend) {
        throw new HttpException('Friend not found', HttpStatus.BAD_REQUEST);
      }
      
      if (await this.isBlocked(user, _friend))
        throw new HttpException('User is blocked', HttpStatus.BAD_REQUEST);

      const userFriends = await this.prisma.user.findFirst({
        where: { login },
        select: { friends: true },
      });

      const friendFriends = await this.prisma.user.findFirst({
        where: { login: friend },
        select: { friends: true },
      });

      for (const f of userFriends.friends)
      {
        if (f.login === friend)
          throw new HttpException('User already a friend', HttpStatus.BAD_REQUEST);
      }

      for (const f of friendFriends.friends)
      {
        if (f.login === login)
          throw new HttpException('User already a friend', HttpStatus.BAD_REQUEST);
      }
      await this.prisma.user.update({
        where: { login },
        data: {
          friends: { connect: { login: friend } },
        },
      });
      await this.prisma.user.update({
        where: { login: friend },
        data: {
          friends: { connect: { login } },
        },
      });

    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async removeFriend(login: string, friend: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { login } });
      const _friend = await this.prisma.user.findUnique({
        where: { login: friend },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      if (!_friend) {
        throw new HttpException('Friend not found', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.user.update({
        where: { login },
        data: {
          friends: { disconnect: { login: friend } },
        },
      });
      await this.prisma.user.update({
        where: { login: friend },
        data: {
          friends: { disconnect: { login } },
        },
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async blockPlayer(blocker: string, blocked: string) {
    try {
      const blockerUser = await this.prisma.user.findUnique({where: {login: blocker}, select: {blockedUsers: true}});
      const blockedUser = await this.prisma.user.findUnique({where: {login: blocked}, select: {blockedBy: true}});
      
      for (const user of blockerUser.blockedUsers)
      {
        if (user.login === blocked)
          throw new HttpException('User already blocked', HttpStatus.BAD_REQUEST);

      }
      
      for (const user of blockedUser.blockedBy) {
        if (user.login === blocker)
          throw new HttpException('User already blocked', HttpStatus.BAD_REQUEST);
    }

      await this.prisma.user.update({
        where: {login: blocker},
        data: {
          blockedUsers: {connect: {login: blocked}}
        }
      });

      await this.prisma.user.update({
        where: {login: blocked},
        data: {
          blockedBy: {connect: {login: blocker}}
        }
      });

      
    }catch (err) {
    throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
}}

  async removeBlock(blocker: string, blocked: string) {
    try {
      const blockerUser = await this.prisma.user.findUnique({where: {login: blocker}});
      const blockedUser = await this.prisma.user.findUnique({where: {login: blocked}});

      if (!blockerUser)
        throw new HttpException('Blocker not found', HttpStatus.BAD_REQUEST);
      if (!blockedUser)
        throw new HttpException('Blocked not found', HttpStatus.BAD_REQUEST);
      await this.prisma.user.update({
        where: {login: blocker},
        data: {
          blockedUsers: {disconnect: {login: blocked}}
        }
      });

      await this.prisma.user.update({
        where: {login: blocked},
        data: {
          blockedBy: {disconnect: {login: blocker}}
        }
      });

    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getProfile(user) {
    try
    {
      const usr = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      return usr;
    }
    catch (e) {
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include : {blockedBy: true, blockedUsers: true, friends: true}
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return user;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findUser(login: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { login },
        include : {blockedBy: true, blockedUsers: true, friends: true}
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return user;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updatePicture(login: string, picture: string) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { login },
        data: { picture },
      });
      return updatedUser;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getHistory(login: string) {
    try {
      const userHistory = await this.prisma.user.findFirst({
        where: { login },
        select: { MatchHistory: true },
      });
      if (!userHistory)
        throw new HttpException('Invalid login', HttpStatus.BAD_REQUEST);
      return userHistory;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getRelations(login: string) {
    try {
      const userRelations = await this.prisma.user.findFirst({
        where: { login },
        select: { blockedUsers: true, blockedBy: true, friends: true },
      });
      if (!userRelations)
        throw new HttpException('Invalid login', HttpStatus.BAD_REQUEST);
      return userRelations;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}