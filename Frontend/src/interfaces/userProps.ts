import { FriendsProps } from './FriendsProps';

export type userProps = {
    user: any;
    id: number;
    intraId: string;
    login: string;
    email: string;
    username: string;
    picture: string;
    status: string;
    level: number;
    inGame: boolean;
    isOnline: boolean;
    Wins: number;
    Lost: number;
    match: number;
    friends: any[];
    achievements: any[];
    blockedBy: any[];
    blockedUsers: any[];
};
