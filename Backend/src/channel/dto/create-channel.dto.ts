import { ChannelType } from '@prisma/client';

export class CreateChannelDto {
    name: string;
    type: ChannelType;
    password?: string;
    member1?: string;
    member2?: string;
    avatar1?: string;
    avatar2?: string;
}

export class UpdateChannelDto {
    channelId: number;
    name: string;
    type: ChannelType;
    password?: string;
}
