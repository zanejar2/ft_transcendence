import { Socket } from "socket.io-client";

interface score
{
    P1: number;
    P2: number;
}

export interface BoardProps {
    GameSocket:Socket | null;
    GameMode:string;
}