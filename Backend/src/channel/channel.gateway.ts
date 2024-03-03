import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { CreateChannelDto, UpdateChannelDto } from './dto/create-channel.dto';
import { BaseGateway } from './base.gateway';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uid } from 'uuid';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChannelGateway extends BaseGateway {
  private alreadyRequested: boolean = false;
  constructor(
    private readonly channelService: ChannelService,
    private readonly channelMemberService: ChannelMemberService,
    private userService: UserService,
    private prisma: PrismaService,
  ) {
    super();
  }

  async handleConnection(client: Socket) {
    try {
      if (client) {
        await this.userService.handleConnection(client);
        const user = await this.userService.getUserOfClient(client.id);
        if (user) {
          const channels = await this.channelService.getChannelsOfUser(user.id);
          if (channels) {
            for (const channel of channels) {
              client.join(channel.name);
            }
          }
          this.userService.updateState(user, true);
          this.server.emit('user connected');
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      if (client) {
        const user = await this.userService.getUserOfClient(client.id);
        if (user) {
          await this.userService.handleDisconnection(client);
          this.userService.updateState(user, false);
          this.server.emit('user disconnected');
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  ////////////////////////////////////   Channel ////////////////////////////////////

  @SubscribeMessage('isOnline')
  async isOnline(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.targetId) {
      const target = await this.userService.findUserById(data.targetId);
      if (target) {
        const isOnline = target.isOnline;
        this.server.to(client.id).emit('isOnline', isOnline);
      }
    }
  }

  @SubscribeMessage('createChannel')
  async createChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() createChannelDto: CreateChannelDto,
  ) {
    const user = await this.userService.getUserOfClient(client.id);
    if (
      user &&
      createChannelDto &&
      createChannelDto.name &&
      createChannelDto.type
    ) {
      const channel = await this.channelService.createChannel(
        createChannelDto,
        user,
      );
      if (channel) {
        client.join(channel.name);
        const users = await this.userService.findUsers();
        if (users) {
          for (const thisuser of users) {
            const sockets = this.userService.getAllSocketsOfUser(thisuser.id);
            this.server
              .to(sockets)
              .emit(
                'findAllNonDmChannels',
                await this.channelService.findNonDmChannels(thisuser),
              );
          }
        }
      }
    }
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const user = await this.userService.getUserOfClient(client.id);
    if (
      user &&
      data &&
      data.channelId &&
      (await this.channelService.isBanned(data.channelId, user.id)) === false &&
      !(await this.channelMemberService.isMemberOfChannel(
        data.channelId,
        user.id,
      ))
    ) {
      const channel = await this.channelService.joinChannel(data, user);
      if (channel) {
        client.join(channel.name);
        this.server
          .to(channel.name)
          .emit(
            'getMessages',
            await this.channelService.getMessages(channel.id, user.id),
          );
      }
    }
  }

  @SubscribeMessage('updateChannel')
  async updateChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateChannelDto: UpdateChannelDto,
  ) {
    const user = await this.userService.getUserOfClient(client.id);
    if (
      user &&
      updateChannelDto &&
      updateChannelDto.channelId &&
      updateChannelDto.name &&
      updateChannelDto.type &&
      (await this.channelMemberService.isOwner(
        updateChannelDto.channelId,
        user.id,
      ))
    ) {
      const channel = await this.channelService.updateChannel(updateChannelDto);
      if (channel) {
        const channels = await this.channelService.findNonDmChannels(user);
        this.server.emit('findAllNonDmChannels', channels);
      }
    }
  }

  @SubscribeMessage('getChannels')
  async getChannels(@ConnectedSocket() client: Socket) {
    const user = await this.userService.getUserOfClient(client.id);
    if (user) {
      const channels = await this.channelService.findNonDmChannels(user);
      if (channels) this.server.to(client.id).emit('getChannels', channels);
    }
  }

  @SubscribeMessage('getChannelMembers')
  async getChannelMembers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.channelId) {
      const channel = await this.channelService.findChannel(data.channelId);
      if (channel) {
        const members = await this.channelMemberService.getMembersOfChannel(
          data.channelId,
        );
        if (members)
          this.server.to(channel.name).emit('getChannelMembers', members);
      }
    }
  }

  @SubscribeMessage('isJoinedToChannel')
  async isJoinedToChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.channelId) {
      const isJoined = await this.channelMemberService.isMemberOfChannel(
        data.channelId,
        user.id,
      );
      if (!isJoined) this.server.to(client.id).emit('isJoinedToChannel');
    }
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.channelId) {
      const channel = await this.channelService.leaveChannel(
        data.channelId,
        user,
      );
      if (channel) {
        client.leave(channel.name);
        const members = await this.channelMemberService.getMembersOfChannel(
          data.channelId,
        );
        const channels = await this.channelService.findNonDmChannels(user);
        if (members && channels) {
          this.server.to(channel.name).emit('getChannelMembers', members);
          this.server.to(client.id).emit('findAllNonDmChannels', channels);
        }
      }
    }
  }

  //////////////////////////////////// DM //////////////////////////////////////////

  @SubscribeMessage('createDm')
  async createDm(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
  try {
    const user = await this.userService.getUserOfClient(client.id);
    if (
      user &&
      data.targetId &&
      !(await this.channelService.findDm(user, data.targetId))
    ) {
      const target = await this.userService.findUserById(data.targetId);
      if (!target) throw new Error('Target not found');
      if (!(await this.channelService.isBlocked(user, target))) {
        const channel = await this.channelService.createDm(user, data.targetId);
        if (channel) {
          client.join(channel.name);
          this.server
            .to(channel.name)
            .emit('findAllDms', await this.channelService.findDms(user));
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
  }

  @SubscribeMessage('deleteDm')
  async removeDm(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.targetId) {
      const dm = await this.channelService.findDm(user, data.targetId);
      if (dm) {
        await this.channelService.deleteDm(dm);
        this.server
          .to(client.id)
          .emit('findAllDms', await this.channelService.findDms(user));
      }
    }
  }

  @SubscribeMessage('getDms')
  async getDms(@ConnectedSocket() client: Socket) {
    const user = await this.userService.getUserOfClient(client.id);
    if (user) {
      const dms = await this.channelService.findDms(user);
      if (dms) this.server.to(client.id).emit('getDms', dms);
    }
  }

  /////////////////////////////// Message /////////////////////////////////////////////

  @SubscribeMessage('createMessage')
  async createMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const user = await this.userService.getUserOfClient(client.id);
    if (
      user &&
      data &&
      data.channelId &&
      (await this.channelService.isMuted(data.channelId, user.id)) === false &&
      (await this.channelMemberService.isMemberOfChannel(
        data.channelId,
        user.id,
      ))
    ) {
      const channel = await this.channelService.findChannel(data.channelId);
      if (channel && data.content) {
        await this.channelService.addMessage(data, channel.id, user);
        const members = await this.channelMemberService.getMembersOfChannel(
          data.channelId,
        );
        if (members) {
          for (const member of members) {
            const sockets = this.userService.getAllSocketsOfUser(member.userId);
            this.server
              .to(sockets)
              .emit(
                'getMessages',
                await this.channelService.getMessages(
                  channel.id,
                  member.userId,
                ),
              );
          }
        }
      }
    }
  }

  @SubscribeMessage('getMessages')
  async getMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const user = await this.userService.getUserOfClient(client.id);
    if (
      user &&
      data &&
      data.channelId &&
      (await this.channelMemberService.isMemberOfChannel(
        data.channelId,
        user.id,
      ))
    ) {
      const channel = await this.channelService.findChannel(data.channelId);
      if (channel) {
        this.server
          .to(client.id)
          .emit(
            'getMessages',
            await this.channelService.getMessages(channel.id, user.id),
          );
      }
    }
  }

  ////////////////////////////////// Members ///////////////////////////////////////////

  @SubscribeMessage('blockUser')
  async blockUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
  try {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.targetId) {
      if (user.id == data.targetId) throw new Error('Action not permitted');
      await this.channelService.blockUser(user, data.targetId);
      const dms = await this.channelService.findDms(user);
      if (dms) this.server.to(client.id).emit('getDms', dms);
    }
  } catch (error) {
    console.log(error.message);
  }
  }

  @SubscribeMessage('sendInvite')
  async sendInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const target = await this.prisma.user.findUnique({
      where: {
        id: data.targetId,
      },
    });

    const user = await this.userService.getUserOfClient(client.id);
    const sockets = await this.userService.getAllSocketsOfUser(data.targetId);
    if (sockets && this.alreadyRequested == false) {
      const socket = sockets[sockets.length - 1];

      if (!target.inGame) {
        this.alreadyRequested = true;
        this.server
          .to(socket)
          .emit('gameRequest', { id: client.id, targetId: user.id });
      }
    }
  }

  @SubscribeMessage('rejectRequest')
  async rejectRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    this.alreadyRequested = false;
  }

  @SubscribeMessage('acceptRequest')
  async acceptRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const user = (await this.userService.getUserOfClient(client.id)).id;
    const token = uid();

    await this.prisma.user.update({
      where: {
        id: data.targetId,
      },
      data: {
        requestGameToken: token,
      },
    });

    await this.prisma.user.update({
      where: {
        id: user,
      },
      data: {
        requestGameToken: token,
      },
    });

    this.alreadyRequested = false;
    this.server.to(client.id).emit('redirectToGame', null);
    this.server.to(data.id).emit('redirectToGame', null);
  }

  @SubscribeMessage('addMemberToPrivateChannel')
  async addMemberToChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
  try {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.channelId && data.targetName) {
      const channel1 = await this.channelService.findChannel(data.channelId);
      const target = await this.prisma.user.findUnique({
        where: {
          login: data.targetName,
        },
      });
      if (!target)
        throw new Error('Target not found'); 
      if (user.id == target.id) throw new Error('Action not permitted');
      if (
        channel1 &&
        channel1.type === 'private' &&
        target &&
        (await this.channelMemberService.isMemberOfChannel(
          channel1.id,
          target.id,
        )) === false &&
        (await this.channelService.isBanned(channel1.id, target.id)) ===
          false &&
        (await this.channelMemberService.isOwner(channel1.id, user.id) || 
        await this.channelMemberService.isAdmin(channel1.id, user.id))
      ) {
        const channel2 = await this.channelService.joinChannel(data, target);
        const members = await this.channelMemberService.getMembersOfChannel(
          channel1.id,
        );
        if (channel2 && members) {
          this.server.to(channel2.name).emit('getChannelMembers', members);
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
  }

  @SubscribeMessage('kickMember')
  async kickMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
  try {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.channelId && data.targetId) {
      if (user.id == data.targetId) throw new Error('Action not permitted');
      const channel = await this.channelService.findChannel(data.channelId);
      if (channel) {
        await this.channelService.kickMember(user, channel.id, data.targetId);
        const members = await this.channelMemberService.getMembersOfChannel(
          channel.id,
        );
        const channels = await this.channelService.findNonDmChannels(user);
        if (members && channels) {
          this.server.emit('getChannelMembers', members);
          this.server.to(client.id).emit('findAllNonDmChannels', channels);
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
  }

  @SubscribeMessage('banMember')
  async banMember(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
  try {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.channelId && data.targetId) {
      if (user.id == data.targetId) throw new Error('Action not permitted');
      const channel = await this.channelService.findChannel(data.channelId);
      if (channel) {
        await this.channelService.banMember(user, channel.id, data.targetId);
        const members = await this.channelMemberService.getMembersOfChannel(
          channel.id,
        );
        if (members) this.server.emit('getChannelMembers', members);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
  }

  @SubscribeMessage('muteMember')
  async muteMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
  try {
    const user = await this.userService.getUserOfClient(client.id);
    if (
      user &&
      data &&
      data.channelId &&
      data.targetId &&
      (await this.channelService.isMuted(data.channelId, data.targetId)) ===
        false
    ) {
      if (user.id == data.targetId) throw new Error('Action not permitted');
      const mute = await this.channelService.muteMember(
        user,
        data.channelId,
        data.targetId,
      );
      if (mute) this.server.emit('muteMember', data.targetId);
    }
  } catch (error) {
    console.log(error.message);
  }
  }

  @SubscribeMessage('unmuteMember')
  async unmuteMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
  try {
    const user = await this.userService.getUserOfClient(client.id);
    if (
      user &&
      data &&
      data.channelId &&
      data.targetId &&
      (await this.channelService.isMuted(data.channelId, data.targetId))
    ) {
      if (user.id == data.targetId) throw new Error('Action not permitted');
      await this.channelService.unmuteMember(
        user,
        data.channelId,
        data.targetId,
      );
    }
  } catch (error) {
    console.log(error.message);
  }
  }

  @SubscribeMessage('setAdmin')
  async setAdmin(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
  try {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.channelId && data.targetId) {
      if (user.id == data.targetId) throw new Error('Action not permitted');
      await this.channelService.setAdmin(user, data.channelId, data.targetId);
    }
  } catch (error) {
    console.log(error.message);
  }
  }

  @SubscribeMessage('unsetAdmin')
  async unsetAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
  try {
    const user = await this.userService.getUserOfClient(client.id);
    if (user && data && data.channelId && data.targetId) {
      if (user.id == data.targetId) throw new Error('Action not permitted');
      await this.channelService.unsetAdmin(user, data.channelId, data.targetId);
    }
  } catch (error) {
    console.log(error.message);
  }
  }
}
