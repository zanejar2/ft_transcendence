import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelActionDto } from './dto/channel-action.dto';
import { ActionType } from '@prisma/client';

@Injectable()
export class ChannelActionService {
    constructor(private prisma: PrismaService) {}

    async createAction (createChannelActionDto: CreateChannelActionDto) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: createChannelActionDto.channelId
                }
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            let action = await this.prisma.channelAction.create({
                data: {
                    channelId: createChannelActionDto.channelId,
                    takerId: createChannelActionDto.takerId,
                    targetId: createChannelActionDto.targetId,
                    actionType: createChannelActionDto.actionType,
                    mutedEnd: createChannelActionDto.mutedEnd

                }
            });
            return action;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getUserActions (channelId: number, userId: number) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channelId
                }
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            let channelActions = await this.prisma.channelAction.findMany({
                where: {
                    channelId: channelId,
                    targetId: userId
                }
            });
            return channelActions;
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteAction (channelId: number, userId: number, actionType: ActionType) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channelId
                }
            });
            if (!channel) {
                throw new Error('Channel not found');
            }
            await this.prisma.channelAction.deleteMany({
                where: {
                        channelId: channelId,
                        targetId: userId,
                        actionType: actionType
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteAll(channelId: number) {
        try {
            await this.prisma.channelAction.deleteMany({
                where: {
                    channelId: channelId
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }
}
