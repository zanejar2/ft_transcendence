
import { PlayerState } from "./Player.State.interface";
import { BallState } from "./Ball.State.interface";


////////////////////////////////////////////////////////////////////
// this interface used to store game state of every launched room //
////////////////////////////////////////////////////////////////////




export interface GameState {
	P1: 	PlayerState | null;
	P2: 	PlayerState | null;
	Ball:	BallState  	| null;
};


