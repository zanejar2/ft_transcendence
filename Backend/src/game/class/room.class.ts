
import { BallState } from "../interfaces/Ball.State.interface";
import { PlayerState } from "../interfaces/Player.State.interface";


export const WCANVAS 	    = 1000 * 0.6;
export const HCANVAS 	    = 1000 * 0.3;
export const PlayerWidth 	= Math.floor(WCANVAS / 60);
export const PlayerHeight 	= Math.floor(HCANVAS / 5);
const P1Y 			        = Math.floor((HCANVAS / 2) - (HCANVAS / 8));
const P1X 			        = Math.floor(WCANVAS / 60);
const P2X 			        = Math.floor(WCANVAS - WCANVAS / 60 - PlayerWidth);
const P2Y 			        = P1Y;
export const BallH 	        = Math.floor(WCANVAS / 70);


export class Room {

    public  PlayerJoined        = 0;
    public  isLaunched: boolean = false;
    public  GameMode:string;
    public  P1:         PlayerState;
    public  P2:         PlayerState;
    public  Ball:       BallState;
    public  RevBall:    BallState;
    
    constructor(
        P1_ID:string, P2_ID:string,
        P1_Name:string, P2_Name:string,
        P1_HCANVAS, P1_WCANVAS,
        P2_HCANVAS, P2_WCANVAS,
        GameMode:string)
    {
        this.GameMode = GameMode;
        this.Ball = {
            x: (WCANVAS / 2),
            y: (HCANVAS / 2),
            velocityX: 1,
            velocityY: 1,
            speed: 2
        }

        this.RevBall = {...this.Ball};
        this.RevBall.velocityX *= -1;
        this.RevBall.x -= BallH;

        this.P1 = {
            x: P1X,
            y: P1Y,
            id: P1_ID,
            wCanvas: P1_WCANVAS,
            hCanvas: P1_HCANVAS,
            score: 0,
            speed: 5,
            name: P1_Name,
        };

        this.P2 = {
            x: P2X,
            y: P2Y,
            id: P2_ID,
            wCanvas: P2_WCANVAS,
            hCanvas: P2_HCANVAS,
            score: 0,
            speed: 5,
            name: P2_Name,
        };
        this.PlayerJoined++;
        if (this.PlayerJoined == 2)
            this.isLaunched = true;
    }

    
    Join(id, newPlayer, PlayerName:string)
    {
        if (this.P1.wCanvas == 0|| this.P1.hCanvas == 0)
        {
            this.P1.id      = id;
            this.P1.wCanvas = newPlayer.wCanvas;
            this.P1.hCanvas = newPlayer.hCanvas;
            this.P1.name    = PlayerName;
        }
        else
        {
            this.P2.id      = id;
            this.P2.wCanvas = newPlayer.wCanvas;
            this.P2.hCanvas = newPlayer.hCanvas;
            this.P2.name    = PlayerName;
        }
        
        this.PlayerJoined++;
        if (this.PlayerJoined == 2)
            this.isLaunched = true;
    }

};