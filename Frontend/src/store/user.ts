import { create } from 'zustand';
import { FriendsProps } from '../interfaces/FriendsProps';
import { Socket } from 'socket.io-client';

export type UserType = {
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
    Wins: number;
    Lost: number;
    match: number;
    achievements: any[];
    friends: FriendsProps[];
    blockedBy: any[];
    blockedUsers: any[];
    ifauthenficate: boolean;
};

type StoreUserType = {
    user: null | UserType;
    isLoggedIn: boolean;
    socketRef: Socket | null;
    gameSocket: Socket | null;
    selectedRoom: number | null;
    selectedRoomMessages: any[] | null;
    selectedRoomMembers: any[] | null;
    selectedRoomMyRole: string | null;
    selectedAllRoom: any[] | null;
    selectedRoomName: string | null;
    isconnected: boolean;
    selectedAllDMs: any[] | null;
    selectedDMs: number | null;
    selectedDMsName: string | null;
    selectedDmsAvatar: string | null;
    targetId: number | null;
    twoFactorAuth: boolean;

    setUser: (userData: UserType) => void;
    setIsLoggedIn: (v: boolean) => void;
    setSocketRef: (socketRef: Socket | null) => void;
    setGameSocketRef: (gameSocket: Socket | null) => void;
    setSelectedRoom: (selectedRoom: number) => void;
    setSelectedRoomMessages: (messages: any[]) => void;
    setSelectedAllRoom: (rooms: any[]) => void;
    setSelectedRoomName: (name: string) => void;
    setIsconnected: (isconnected: boolean) => void;
    setSelectedAllDms: (DMs: any[]) => void;
    setSelectedDMs: (roomDmId: number) => void;
    setSelectedDMsName: (name: string) => void;
    setSelectedRoomMumber: (members: any[]) => void;
    setSelectedDmsAvatar: (avatar: string) => void;
    setTargetId: (id: number) => void;
    setTwoFactorAuth: (v: boolean) => void;
    setIfauthenficate: (v: boolean) => void;
};

export const userStore = create<StoreUserType>()((set, get) => ({
    user: null,
    isLoggedIn: false,
    socketRef: null,
    selectedRoom: null,
    selectedRoomMessages: null,
    selectedRoomMembers: null,
    selectedRoomMyRole: null,
    selectedAllRoom: null,
    selectedRoomName: null,
    isconnected: false,
    selectedDMs: null,
    selectedAllDMs: null,
    selectedDMsName: null,
    selectedDmsAvatar: null,
    targetId: null,
    gameSocket: null,
    twoFactorAuth: false,

    // setSelectedAllRoom: (rooms: any[]) => {
    //   set({ selectedAllRoom: rooms });
    // },

    // setSelectedRoomMumber: (members: any[]) => {
    //   set({ selectedRoomMembers: members });
    // },

    // setSelectedRoomMessages: (messages: any[]) => {
    //   set({ selectedRoomMessages: messages });
    // },

    setSelectedRoom(roomId: number) {
        const myId = get().user?.id;
        set((state) => ({ ...state, selectedRoom: roomId }));
        get().socketRef?.emit('getMessages', { channelId: roomId });
        get()
            .socketRef?.off('getMessages')
            .on('getMessages', (messages) => {
                if (messages.length && messages[0].channelId === roomId)
                    set({ selectedRoomMessages: messages });
            });

        get().socketRef?.emit('getChannelMembers', { channelId: roomId });
        get()
            .socketRef?.off('getChannelMembers')
            .on('getChannelMembers', (members) => {
                if (members.length && members[0].channelId === roomId)
                    set({
                        selectedRoomMembers: members,
                        selectedRoomMyRole: getMyRole(members, myId as number)
                    });
            });
    },

    setSelectedDMs(roomDmId: number) {
        set((state) => ({ ...state, selectedDMs: roomDmId }));
        get().socketRef?.emit('getMessages', { channelId: roomDmId });
        get()
            .socketRef?.off('getMessages')
            .on('getMessages', (messages) => {
                if (messages.length && messages[0].channelId === roomDmId)
                    set({ selectedRoomMessages: messages });
            });
    },

    setSelectedDMsName(name: string) {
        set((state) => ({ ...state, selectedRoomName: name }));
    },

    setSelectedDmsAvatar(avatar: string) {
        set((state) => ({ ...state, selectedDmsAvatar: avatar }));
    },
    setSelectedAllRoom: (rooms: any[]) => {
        set((state) => ({ ...state, selectedAllRoom: rooms }));
    },

    setSelectedRoomMumber: (members: any[]) => {
        set((state) => ({ ...state, selectedRoomMembers: members }));
    },

    setSelectedRoomMessages: (messages: any[]) => {
        set((state) => ({ ...state, selectedRoomMessages: messages }));
    },

    setSelectedAllDms(DMs: any[]) {
        set((state) => ({ ...state, selectedAllDMs: DMs }));
    },

    setSelectedRoomName(name: string) {
        set((state) => ({ ...state, selectedRoomName: name }));
    },

    setIsconnected(isconnected) {
        set((state) => ({ ...state, isconnected }));
    },

    setIsLoggedIn(v) {
        set((state) => ({ ...state, isLoggedIn: v }));
    },

    setSocketRef(socketRef: Socket | null) {
        set((state) => ({ ...state, socketRef }));
    },

    setGameSocketRef(gameSocket: Socket | null) {
        set({ gameSocket: gameSocket });
    },

    setUser(userData) {
        set((state) => ({ ...state, user: userData }));
    },

    setTwoFactorAuth(v) {
        set((state) => ({ ...state, twoFactorAuth: v }));
    },
    setIfauthenficate(v) {
        set((state) => ({ ...state, ifauthenficate: v }));
    },
    setTargetId(id: number) {
        set({ targetId: id });
    }
}));

function getMyRole(members: any[], myId: number) {
    return members.find((m) => m.userId === myId).role;
}
