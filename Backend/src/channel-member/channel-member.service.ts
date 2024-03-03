import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelMemberDto } from './dto/channel-member.dto';
import { ChannelRole } from './dto/channel-member.dto';
import { Channel } from 'diagnostics_channel';
@Injectable()
export class ChannelMemberService {
    constructor(private prisma: PrismaService) {}

    async addMember (createChannelMemberDto: CreateChannelMemberDto) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: createChannelMemberDto.channelId
                }
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            await this.prisma.channelMember.create({
                data: {
                    channelId: channel.id,
                    userId: createChannelMemberDto.userId,
                    role: createChannelMemberDto.role,
                    username: createChannelMemberDto.username,
                    avatar: createChannelMemberDto.avatar
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async removeMember (channelId: number, userId: number) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channelId
                }
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            let channelMember = await this.prisma.channelMember.findUnique({
                where: {
                    channelId_userId: {
                        channelId: channelId,
                        userId: userId
                    }
                }
            });
            if (!channelMember) {
                throw new Error('Channel member not found');
            }
            await this.prisma.channelMember.delete({
                where: {
                    channelId_userId: {
                        channelId: channelId,
                        userId: userId
                    }
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async getMembersOfChannel (channelId: number) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channelId
                }
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            let channelMembers = await this.prisma.channelMember.findMany({
                where: {
                    channelId: channelId,
                },
                include: {user: true}
            });
            return channelMembers;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getMemberRole (channelId: number, userId: number) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channelId
                }
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });
            if (!user) {
                throw new Error('User not found');
            }
            let channelMember = await this.prisma.channelMember.findUnique({
                where: {
                    channelId_userId: {
                        channelId: channelId,
                        userId: userId
                    }
                }
            });
            return channelMember.role;
        } catch (error) {
            console.log(error.message);
        }
    }

    async updateMemberRole (channelId: number, userId: number, role: ChannelRole) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channelId
                }
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });
            if (!user) {
                throw new Error('User not found');
            }
            await this.prisma.channelMember.update({
                where: {
                    channelId_userId: {
                        channelId: channelId,
                        userId: userId
                    }
                },
                data: {
                    role: role
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async isMemberOfChannel (channelId: number, userId: number) {
        try {
            const channelMember = await this.getMember(channelId, userId);
            if (channelMember) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getMember (channelId: number, userId: number) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channelId
                }
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });
            if (!user) {
                throw new Error('User not found');
            }
            const channelMember = await this.prisma.channelMember.findFirst({
                where: {
                    channelId: channel.id,
                    userId: user.id   
                }
            });
            return channelMember;
        } catch (error) {
            console.log(error.message);
        }
    }

    async isOwner (channelId: number, userId: number) {
        try {
            const channelMember = await this.getMember(channelId, userId);
            if (channelMember && channelMember.role == ChannelRole.OWNER) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error.message);
        }
    }

    async isAdmin (channelId: number, userId: number) {
        try {
            const channelMember = await this.getMember(channelId, userId);
            if (channelMember && channelMember.role == ChannelRole.ADMIN) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error.message);
        }
    }

    async isMember (channelId: number, userId: number) {
        try {
            const channelMember = await this.getMember(channelId, userId);
            if (channelMember && channelMember.role == ChannelRole.MEMBER) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error.message);
        }
    }

    async setAdmin (channelId: number, userId: number) {
        try {
            await this.updateMemberRole(channelId, userId, ChannelRole.ADMIN);
        } catch (error) {
            console.log(error.message);
        }
    }

    async unsetAdmin (channelId: number, userId: number) {
        try {
            await this.updateMemberRole(channelId, userId, ChannelRole.MEMBER);
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteAll(channelId: number) {
        try {
            await this.prisma.channelMember.deleteMany({
                where: {
                    channelId: channelId
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }
}
