import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "react-p5-wrapper";
import 					p5 							from "p5"
import 					{ useEffect, useState } 				from "react";
import 					{ GameProps } 				from "./Interface/game.props.interface";

// Pixel Mode Assets
import 					PixelPlayer 				from './assets/Pixel Mode/Player 1.png'
import 					PixelCanvas 				from './assets/Pixel Mode/Canvas.png'
import 					PixelBall 					from './assets/Pixel Mode/Ball.png'
import 					PixelWin 					from './assets/Pixel Mode/You Won.png'
import 					PixelLost 					from './assets/Pixel Mode/You Lost.png'
import 					PixelWinDisconnect 			from './assets/Pixel Mode/You Won Disconnect.png'


// Class
import 					{ Player } 					from "./class/player.class";
import 					{ Ball } 					from "./class/ball.class";
import 					GameNavBar 					from "../../components/GameNavbar/GameNavBar";
import { useNavigate } from "react-router-dom";

// Game Properties
export let canvasWidth 		= Math.floor(window.innerWidth * 0.6);
export let canvasHeight 	= Math.floor(window.innerWidth * 0.3);
export let P1y 				= Math.floor((canvasHeight / 2) - (canvasHeight / 8));
export let BallHeight 		= Math.floor(canvasWidth / 70);
export let PlayerWidth 		= Math.floor(canvasWidth / 60);
export let PlayerHeight 	= Math.floor(canvasHeight / 5);
export let P1x 				= Math.floor(canvasWidth / 60);
export let P2x 				= Math.floor(canvasWidth - canvasWidth / 60 - PlayerWidth);
export let P2y 				= P1y;



let P2Y 				= P2y;
let ballPos				= {x: 50, y: 50};
let GameState:string 	= '';
let normilizedY:number = 0;

const Game: React.FC<GameProps> = (props) =>
{
	let Canvas:string;
	let PlayerTexture:string;
	let BallTexture:string;
	let WinTexture:string;
	let LostTexture:string;
	let WinDesconnectTexture:string;

	Canvas 					= PixelCanvas;
	BallTexture 			= PixelBall;
	PlayerTexture 			= PixelPlayer;
	WinTexture				= PixelWin;
	LostTexture 			= PixelLost;
	WinDesconnectTexture 	= PixelWinDisconnect;


	const navigate = useNavigate();
	useEffect(() => {

		props.GameSocket?.on("UpdatePlayer", (newPlayerPos) => {
			P2Y = newPlayerPos.y;

			if (newPlayerPos.normilizeY)
			{
				normilizedY = newPlayerPos.normilizeY;
			}
		})
		
		props.GameSocket?.on("UpdateBall", (newBallPos) => {
			ballPos = newBallPos;
		})

		props.GameSocket?.on("GameState", (gameState) => {
			GameState = gameState;

			setTimeout(() => {
				props.GameSocket?.emit('leaveGame', null);
				navigate('/Home');
				GameState = '';
			}, 1000)
		})


	}, []);


	const sketch : Sketch = (p5 : P5CanvasInstance) => {
		let P1:Player 					= new Player(p5, 'P1');
		let P2:Player 					= new Player(p5, 'P2');
		let ball:Ball 					= new Ball(p5, canvasWidth / 2, canvasHeight / 2);
		let GameBackground:	p5.Image;
		let Win: p5.Image;
		let Lost: p5.Image;
		let WinDisconnect: p5.Image;
		let canvas:			p5.Renderer;
		

		Win = p5.loadImage(WinTexture);
		Lost = p5.loadImage(LostTexture);

		p5.preload = () => {
			GameBackground = p5.loadImage(Canvas);
			P1.loadTextures(PlayerTexture);
			P2.loadTextures(PlayerTexture);
			ball.loadTextures(BallTexture);
			WinDisconnect = p5.loadImage(WinDesconnectTexture);
		}

		p5.setup = () => {
			
			
			canvas = p5.createCanvas(canvasWidth, canvasHeight);

			
			canvas.position(window.innerWidth / 2 - canvasWidth / 2 , window.innerHeight / 2 - canvasHeight / 3);
			p5.frameRate(120);
		}
		
		p5.windowResized = () => {
			canvasWidth 	= Math.floor(window.innerWidth * 0.6);
			canvasHeight 	= Math.floor(window.innerWidth * 0.3);
			BallHeight 		= Math.floor(canvasWidth / 70);
			PlayerWidth 	= Math.floor(canvasWidth / 60);
			PlayerHeight 	= Math.floor(canvasHeight / 5);
			P1x 			= Math.floor(canvasWidth / 60);
			P2x 			= Math.floor(canvasWidth - canvasWidth / 60 - PlayerWidth);

			if (p5)
			{
				props.GameSocket?.emit('resizeScreen', {
					hCanvas: canvasHeight, wCanvas: canvasWidth
				});
				
				P1.setPlayerState(normilizedY);
				p5.resizeCanvas(canvasWidth, canvasHeight);
				
				canvas = p5.createCanvas(canvasWidth, canvasHeight);
				
				canvas.position(window.innerWidth / 2 - canvasWidth / 2 , window.innerHeight / 2 - canvasHeight / 3);
				
			}
		
		}

		p5.draw = () => {


			if (GameState == 'Win')
			{
				p5.background(Win);			
			}
			else if (GameState == 'Lost')
			{
				p5.background(Lost);	
			}
			else if (GameState == 'Disconnect')
			{
				p5.background(WinDisconnect);			
			}
			else
			{
				P2.setPlayerState(P2Y);
				ball.setBallState(ballPos);

				if (p5.keyIsDown(87)) // UP
				{
					P1.UpdatePlayer(-1);
					
					props.GameSocket?.emit("updatePlayer", {
						RoomId: 		props.RoomId,
						y: 				P1.getPY
					});
				}

				if (p5.keyIsDown(83)) // DOWN
				{

					P1.UpdatePlayer(1);
					props.GameSocket?.emit("updatePlayer", {
						RoomId: 		props.RoomId,
						y: 				P1.getPY
					});


				}


				p5.background(GameBackground);
				P1.Draw();
				P2.Draw();
				ball.Draw();
			}

		}
	  }
	



  	return (
		<>
			<ReactP5Wrapper sketch={sketch} />
			{/* <GameNavBar /> */}

		</>
	);
}

export default Game;