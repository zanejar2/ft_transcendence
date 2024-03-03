import { P5CanvasInstance } from "react-p5-wrapper";
import { PlayerState } 		from "../Interface/player.state.interface";
import { canvasHeight, PlayerHeight, PlayerWidth, P1x, P2x, P1y, P2y } from '../Game';


export class Player
{
	private ballTexture:	any;
	
	private p5:				P5CanvasInstance | null 	= null;
	
	public playerState:	PlayerState;

	private player:string = '';

	constructor(p5:P5CanvasInstance, player:string)
	{		
		const x 			= (player == 'P1') ? P1x : P2x;
		const y 			= (player == 'P1') ? P1y : P2y;

		this.p5 			= p5;
		this.player 		= player;
		this.playerState 	= {x: x, y: y, wPlayer: PlayerWidth, hPlayer: PlayerHeight, speed: 5, score:0};
	}

	loadTextures(BallTexture:any)
	{
		this.ballTexture = this.p5?.loadImage(BallTexture);
	}

	UpdatePlayer(direction:number): PlayerState
	{
		if (direction < 0 && this.playerState.y < 0)
		{
			this.playerState.y = 0;
		}
		else if (direction > 0 && (this.playerState.y + PlayerHeight) > canvasHeight)
		{
			this.playerState.y = canvasHeight - PlayerHeight;
		}
		else
			this.playerState.y += (direction * this.playerState.speed);

		return (this.playerState);
	}

	Draw()
	{
		this.p5?.image(this.ballTexture, (this.player == 'P1') ? P1x : P2x, this.playerState.y, PlayerWidth, PlayerHeight);
	}


	setPlayerState(y: number)
	{
		this.playerState.y = y;
	}

	get getPY()
	{
		return ((this.playerState.y / canvasHeight) * (1000 * 0.3));
	}
}