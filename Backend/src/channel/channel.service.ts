/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateChannelDto, UpdateChannelDto } from './dto/create-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelRole } from 'src/channel-member/dto/channel-member.dto';
import { ChannelType } from '@prisma/client';
import { ChannelActionService } from 'src/channel-action/channel-action.service';
import { ActionType } from 'src/channel-action/dto/channel-action.dto';
import { MessageService } from 'src/message/message.service';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { v4 as uid } from 'uuid';
import { ChannelGateway } from './channel.gateway';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private channelMember: ChannelMemberService,
    private channelAction: ChannelActionService,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  async getChannelsOfUser(userId: number) {
    try {
      return await this.prisma.channel.findMany({
        where: {
          channelMembers: {
            some: {
              userId: userId,
            },
          },
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async createChannel(createChannelDto: CreateChannelDto, user: any) {
    try {
      let hashedPassword = null;
      if (createChannelDto.type == ChannelType.protected && 
        (!createChannelDto.password || createChannelDto.password === undefined || createChannelDto.password === '')) {
        throw new Error('Password is required for protected group');
      }
      if (
        createChannelDto.password &&
        createChannelDto.type == ChannelType.protected
        ) {
        const salt = await bcrypt.genSalt();
        hashedPassword = await bcrypt.hash(createChannelDto.password, salt);
      }
      const checkChannel = await this.prisma.channel.findUnique({
        where: {
          name: createChannelDto.name,
        },
      });
      if (checkChannel) {
        throw new Error('Channel already exists');
      }
      const channel = await this.prisma.channel.create({
        data: {
          name: createChannelDto.name,
          type: createChannelDto.type,
          password: hashedPassword,
          member1: createChannelDto.member1,
          member2: createChannelDto.member2,
          avatar1: createChannelDto.avatar1,
          avatar2: createChannelDto.avatar2,
        },
      });
      if (channel) {
        await this.channelMember.addMember({
          channelId: channel.id,
          userId: user.id,
          username: user.login,
          role: ChannelRole.OWNER,
          avatar: user.picture
        });
      }
      return channel;
    } catch (error) {
      console.log(error.message);
    }
  }

  async joinChannel(data: any, target: any) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: data.channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      if (channel.type == ChannelType.protected && !data.password) {
        throw new Error('Password required');
      }
      if (
        channel.type == ChannelType.protected &&
        !(await this.checkPassword(channel.id, data.password))
      ) {
        throw new Error('Wrong password');
      }
      if (channel.type != ChannelType.dm) {
        await this.channelMember.addMember({
          channelId: channel.id,
          userId: target.id,
          username: target.login,
          role: ChannelRole.MEMBER,
          avatar: target.picture
        });
        return channel;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async addMessage(data: any, channelId: number, user: any) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new Error('Channel not found');
    }
    await this.messageService.createMessage({
      content: data.content,
      channelId: channelId,
      senderId: user.id,
      username: user.login,
    });
  }

  async getMessages(channelId: number, userId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      const messages = await this.messageService.getMessages(channelId, userId);
      return messages;
    } catch (error) {
      console.log(error.message);
    }
  }

  async leaveChannel(channelId: number, user: any) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      if (await this.channelMember.isOwner(channelId, user.id))
        throw new Error('Action not permitted');
      await this.channelMember.removeMember(channelId, user.id);
      return channel;
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteChannel(user: any, channelId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      if (await this.channelMember.isOwner(channelId, user.id)) {
        await this.messageService.deleteAll(channel.id);
        await this.channelAction.deleteAll(channel.id);
        await this.channelMember.deleteAll(channel.id);
        await this.prisma.channel.delete({
          where: {
            id: channelId,
          },
        });
        return 'deleted';
      }
      return 'not';
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateChannel(updateChannelDto: UpdateChannelDto) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: updateChannelDto.channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      if (!updateChannelDto.password || updateChannelDto.password === undefined) {
        updateChannelDto.password = null;
      }
      else
        updateChannelDto.password = await bcrypt.hash(updateChannelDto.password, await bcrypt.genSalt());
      await this.prisma.channel.update({
        where: {
          id: updateChannelDto.channelId,
        },
        data: {
          name: updateChannelDto.name,
          type: updateChannelDto.type,
          password: updateChannelDto.password,
        },
      });
      return channel;
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteDm(channel: any) {
    try {
      if (channel.type == ChannelType.dm) {
        await this.messageService.deleteAll(channel.id);
        await this.channelAction.deleteAll(channel.id);
        await this.channelMember.deleteAll(channel.id);
        await this.prisma.channel.delete({
          where: {
            id: channel.id,
          },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async findNonDmChannels(user: any) {
    try {
      const rooms = await this.prisma.channel.findMany({
        where: {
          OR: [
            {
              type: {
                in: ['protected', 'public'],
              },
            },
            {
              type: 'private',
              channelMembers: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },
      });
      return rooms;
    } catch (error) {
      console.log(error.message);
    }
  }

  async createDm(user: any, targetId: number) { 
    try {
      const target = await this.prisma.user.findUnique({
        where: {
          id: targetId,
        },
      });
      if (!target) {
        throw new Error('Target not found');
      }
      const channel = await this.createChannel(
        {
          name: `${user.login} - ${target.login}`,
          type: ChannelType.dm,
          member1: user.login,
          member2: target.login,
          avatar1: user.picture,
          avatar2: target.picture,
        },
        user,
      );
      if (channel) {
        await this.channelMember.addMember({
          channelId: channel.id,
          userId: targetId,
          role: ChannelRole.MEMBER,
          username: target.login,
          avatar: target.picture
        });
      }
      return channel;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findDms(user: any) {
    try {
      return await this.prisma.channel.findMany({
        where: {
          type: 'dm',
          channelMembers: {
            some: {
              userId: user.id,
            },
          },
        },
        include: {
          channelMembers: {
            include: {
              user: true,
            },
          }
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async findDm(user: any, targetId: number) {
    try {
      const target = await this.prisma.user.findUnique({
        where: {
          id: targetId,
        },
      });
      if (!target) {
        throw new Error('Target not found');
      }
      return await this.prisma.channel.findFirst({
        where: {
          type: {
            in: ['dm'],
          },
          AND: [
            {
              channelMembers: {
                some: {
                  userId: user.id,
                },
              },
            },
            {
              channelMembers: {
                some: {
                  userId: targetId,
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async findChannel(channelId: number) {
    try {
      return await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async kickMember(user: any, channelId: number, targetId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      const target = await this.prisma.user.findUnique({
        where: {
          id: targetId,
        },
      });
      if (!target) {
        throw new Error('Target not found');
      }
      if (
        (await this.channelMember.isOwner(channelId, user.id) ||
          await this.channelMember.isAdmin(channelId, user.id)) &&
        await this.channelMember.isMember(channelId, target.id)
      ) {
        await this.channelMember.removeMember(channelId, targetId);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async banMember(user: any, channelId: number, targetId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      const target = await this.prisma.user.findUnique({
        where: {
          id: targetId,
        },
      });
      if (!target) {
        throw new Error('Target not found');
      }
      if (
        (await this.channelMember.isAdmin(channelId, user.id) &&
          await this.channelMember.isMember(channelId, target.id)) ||
        await this.channelMember.isOwner(channelId, user.id)
      ) {
        await this.channelAction.createAction({
          channelId: channelId,
          takerId: user.id,
          targetId: targetId,
          actionType: ActionType.BAN,
        });
        await this.kickMember(user, channelId, targetId);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async muteMember(user: any, channelId: number, targetId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      const target = await this.prisma.user.findUnique({
        where: {
          id: targetId,
        },
      });
      if (!target) {
        throw new Error('Target not found');
      }
      if (
        (await this.channelMember.isAdmin(channelId, user.id) &&
          await this.channelMember.isMember(channelId, target.id)) ||
        await this.channelMember.isOwner(channelId, user.id)
      ) {
        const action = await this.channelAction.createAction({
          channelId: channelId,
          takerId: user.id,
          targetId: targetId,
          actionType: ActionType.MUTE,
          mutedEnd: new Date(new Date().getTime() + 10 * 60000),
        });
        if (!action)
          throw new Error('Muting action failed');
        return action;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async unmuteMember(user: any, channelId: number, targetId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      const target = await this.prisma.user.findUnique({
        where: {
          id: targetId,
        },
      });
      if (!target) {
        throw new Error('Target not found');
      }
      if (
        await this.channelMember.isOwner(channelId, user.id) ||
        (await this.channelMember.isAdmin(channelId, user.id) &&
        await this.channelMember.isMember(channelId, target.id))
      ) {
        await this.channelAction.deleteAction(
          channelId,
          targetId,
          ActionType.MUTE,
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async blockUser(user: any, targetId: number) {
    try {
      const target = await this.prisma.user.findUnique({
        where: {
          id: targetId,
        },
      });
      if (!target) {
        throw new Error('Target not found');
      }
      if (!(await this.isBlocked(user, target))) {
        this.userService.blockPlayer(user.login, target.login);
        this.userService.removeFriend(user.login, target.login);
        const channel = await this.findDm(user, targetId);
        if (channel) {
          await this.deleteDm(channel);
        }
      } 
      else 
        throw new Error('User already blocked');
    } catch (error) {
      console.log(error.message);
    }
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


  async isBanned(channelId: number, userId: number) {
    try {
      const actions = await this.channelAction.getUserActions(
        channelId,
        userId,
      );
      if (actions.some((action) => action.actionType == ActionType.BAN)) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error.message);
    }
  }

  async isMuted(channelId: number, userId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      const actions = await this.channelAction.getUserActions(
        channelId,
        userId,
      );
      if (actions) {
        const actual = actions.find(
          (action) =>
            action.actionType == ActionType.MUTE &&
            action.mutedEnd > new Date(),
        );
        if (actual) 
          return true;
        else
          await this.channelAction.deleteAction(
            channelId,
            userId,
            ActionType.MUTE,
          );
      }
      return false;
    } catch (error) {
      console.log(error.message);
    }
  }

  async setAdmin(user: any, channelId: number, targetId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      const target = await this.prisma.user.findUnique({
        where: {
          id: targetId,
        },
      });
      if (!target) {
        throw new Error('Target not found');
      }
      if (
        await this.channelMember.isOwner(channelId, user.id) &&
        await this.channelMember.isMember(channelId, target.id)
      ) {
        await this.channelMember.setAdmin(channelId, targetId);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async unsetAdmin(user: any, channelId: number, targetId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      const target = await this.prisma.user.findUnique({
        where: {
          id: targetId,
        },
      });
      if (!target) {
        throw new Error('Target not found');
      }
      if (
        await this.channelMember.isOwner(channelId, user.id) &&
        await this.channelMember.isAdmin(channelId, target.id)
      ) {
        await this.channelMember.unsetAdmin(channelId, targetId);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async setPassword(user: any, channelId: number, password: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (channel && (await this.channelMember.isOwner(channelId, user.id))) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await this.prisma.channel.update({
          where: {
            id: channelId,
          },
          data: {
            password: hashedPassword,
            type: ChannelType.protected,
          },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async removePassword(user: any, channelId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (channel && channel.type == ChannelType.protected) {
        await this.prisma.channel.update({
          where: {
            id: channelId,
          },
          data: {
            password: null,
            type: ChannelType.public,
          },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async checkPassword(channelId: number, password: string) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (channel && channel.type != ChannelType.protected) {
        return true;
      }
      else if (channel && channel.type == ChannelType.protected) {
        if (!password || password === undefined) 
          return false;
        const pss = await bcrypt.compare(password, channel.password);
        return pss;
      }
      return false;
    } catch (error) {
      console.log(error.message);
    }
  }

  async updatePassword(
    channelId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    try {
      if (await this.checkPassword(channelId, oldPassword)) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await this.prisma.channel.update({
          where: {
            id: channelId,
          },
          data: {
            password: hashedPassword,
          },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

}
