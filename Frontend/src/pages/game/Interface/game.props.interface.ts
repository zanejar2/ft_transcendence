import { Socket } from "socket.io-client";

export interface GameProps {
	GameSocket: 	Socket | null;
	RoomId:			string;
	GameMode: 		string;
}