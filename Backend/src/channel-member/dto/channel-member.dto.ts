export enum ChannelRole {
    OWNER = 'owner',
    MEMBER = 'member',
    ADMIN = 'admin',
}

export class CreateChannelMemberDto {
    channelId: number;
    userId: number;
    username: string;
    role: ChannelRole;
    avatar: string;
}