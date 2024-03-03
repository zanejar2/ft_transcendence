export enum ActionType {
    KICK = 'kick',
    BAN = 'ban',
    MUTE = 'mute',
}

export class CreateChannelActionDto {
    channelId: number;
    takerId: number;
    targetId: number;
    actionType: ActionType;
    mutedEnd?: Date;
}

