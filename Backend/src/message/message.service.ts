/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { createMessageDto } from './dto/message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService) {}
    async createMessage(createMessageDto: createMessageDto) {
        try {
            const message = await this.prisma.message.create({
                data: {
                    content: createMessageDto.content,
                    channelId: createMessageDto.channelId,
                    senderId: createMessageDto.senderId,
                    username: createMessageDto.username
                }
            });
            return message;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getMessages(channelId: number, userId: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });
            const relations = await this.prisma.user.findFirst({
                where: { login: user.login },
                select: { blockedUsers: true, blockedBy: true },
              });
            let blocked = [], blockedIds = [], blocker = [], blockerIds = [];
            if (relations) {
                blocked = relations.blockedUsers;
                blockedIds = blocked.map((user) => user.id);
                blocker = relations.blockedBy;
                blockerIds = blocker.map((user) => user.id);
            }
            const messages = await this.prisma.message.findMany({
                where: {
                    channelId: channelId,
                    NOT: {
                        senderId: {
                          in: [...blockedIds, ...blockerIds],
                        },
                    },
                },
                include: {sender: true},
                orderBy: { createdAt: 'desc' },
                take: 50               
            });
            return messages;
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteAll(channelId: number) {
        try {
            await this.prisma.message.deleteMany({
                where: {
                    channelId: channelId
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    }
}
