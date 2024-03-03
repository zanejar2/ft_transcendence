import { BallState } from "./ball.state.interface";
import { PlayerState } from "./player.state.interface";


export interface GameState {
	P1: 	PlayerState | null;
	P2: 	PlayerState | null;
	Ball:	BallState  	| null;
};