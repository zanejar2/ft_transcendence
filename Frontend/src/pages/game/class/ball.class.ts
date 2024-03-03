import { P5CanvasInstance } from "react-p5-wrapper";
import { BallState } from "../Interface/ball.state.interface";
import { BallHeight } from "../Game";

export class Ball
{
	private ballTexture:	any;
	private p5:				P5CanvasInstance | null 	= null;
	private ballState: 		BallState 					= {x: 0, y: 0, velocityX: 0, velocityY: 0};
	
	constructor(p5:P5CanvasInstance, x:number, y:number)
	{
		this.p5 				= p5;
		this.ballState.x 		= x;
		this.ballState.y		= y;
	}

	loadTextures(ballTexture:any)
	{
		this.ballTexture = this.p5?.loadImage(ballTexture);
	}

	
	Draw()
	{
		this.p5?.image(this.ballTexture, this.ballState.x, this.ballState.y, BallHeight, BallHeight);
	}


	setBallState(ball:any)
	{
		this.ballState.x = ball.x;
		this.ballState.y = ball.y;
	}
}