import 		{ P5CanvasInstance, ReactP5Wrapper, Sketch } 	from "react-p5-wrapper";
import 						p5 								from "p5"
import 		{ canvasHeight, canvasWidth } 					from "./Game";
import 		{ BoardProps } 									from "./Interface/board.props.interface";
import 		{ useEffect } 									from "react";

// Pixel Board Assets
import 		PixelBoard 										from './assets/Pixel Mode/Board.png'
import 		PixelNumberZero 								from './assets/Pixel Mode/0.png'
import 		PixelNumberOne 									from './assets/Pixel Mode/1.png'
import 		PixelNumberTwo 									from './assets/Pixel Mode/2.png'
import 		PixelNumberThree 								from './assets/Pixel Mode/3.png'
import 		PixelNumberFour									from './assets/Pixel Mode/4.png'
import 		PixelNumberFive 								from './assets/Pixel Mode/5.png'
import 		PixelNumberSix									from './assets/Pixel Mode/6.png'
import 		PixelNumberSeven 								from './assets/Pixel Mode/7.png'


let wCanvas = canvasWidth * 0.9;
let hCanvas = canvasHeight * 0.15;

export let P1Name:string = '';
export let P2Name:string = '';

let BoardData = {
	P1Image: '',
	P2Image: '',
	P1Name: '',
	P2Name: '',
	Score: {
		P1: 0,
		P2: 0,
	}
};


const ScoreGame: React.FC<BoardProps> = (props) =>
{
	let Canvas = '';
	let NumbersTexture:string[] = [];
	
	Canvas = PixelBoard;
	NumbersTexture.push(PixelNumberZero);
	NumbersTexture.push(PixelNumberOne);
	NumbersTexture.push(PixelNumberTwo);
	NumbersTexture.push(PixelNumberThree);
	NumbersTexture.push(PixelNumberFour);
	NumbersTexture.push(PixelNumberFive);
	NumbersTexture.push(PixelNumberSix);
	NumbersTexture.push(PixelNumberSeven);

	if (props.GameMode == 'Reflex')
	{
		// Load Pixel Mode Assets
	}
	else if (props.GameMode == 'Normal')
	{

	}
	
	useEffect(() => {
		
		BoardData = {
			P1Image: '',
			P2Image: '',
			P1Name: '',
			P2Name: '',
			Score: {
				P1: 0,
				P2: 0,
			}
		};
		// Update Player Board		
		props.GameSocket.on('UpdateBoard', (Board) => {
			BoardData.Score = Board.Score;
			
		})

		props.GameSocket.on('LoadBoard', (PlayerData) => {
			P1Name = PlayerData.P1Name;
			P2Name = PlayerData.P2Name;
		})

		return () => {
			// props.GameSocket.off('LoadBoard');
			props.GameSocket.off('UpdateBoard');
		}
	}, []);


	const sketch : Sketch = (p5 : P5CanvasInstance) => {
		let canvas:	p5.Renderer;
		let Board: 	p5.Image;
		let Numbers: p5.Image[] = [];
		


			for (let idx = 0; idx < NumbersTexture.length ; idx++) {
				Numbers.push(p5.loadImage(NumbersTexture[idx]));	
			}
			


			
			p5.preload = () => {
				Board = p5.loadImage(Canvas);
				
				// Load Assets
			}

			p5.setup = () => {
				canvas = p5.createCanvas(wCanvas, hCanvas);


				canvas.position(window.innerWidth / 2 - (canvas.width / 2) , (window.innerHeight / 2) - (canvasHeight / 3) - canvas.height);
				p5.frameRate(120);
			}

			p5.windowResized = () => {
				wCanvas = canvasWidth * 0.9;
				hCanvas = canvasHeight * 0.15;

				p5.resizeCanvas(wCanvas, hCanvas);
				
				canvas = p5.createCanvas(wCanvas, hCanvas);
				
				canvas.position(window.innerWidth / 2 - (canvas.width / 2) , (window.innerHeight / 2) - (canvasHeight / 3) - canvas.height);

				
			}

			p5.draw = () => {
				// Draw Board Background
				p5.background(Board);

				// P1 Image 


				// P1 Name
				p5.textAlign(p5.CENTER, p5.TOP);
				p5.fill("#ededed");
        	    p5.textSize((3 / 100) * canvas.width);

				// P1 State:
        	    p5.text(P1Name, canvas.width / 6, canvas.height - (60 / 100 * canvas.height));

				// P1 Score

				p5.image(Numbers[BoardData.Score.P1], canvasWidth / 2 - (17 / 100 * canvas.width), canvas.height - (70 / 100 * canvas.height), canvasHeight / 12, canvasHeight / 12);

				// P2 Image


				// P2 Name
        	    p5.text(P2Name, canvas.width - (canvas.width / 6), canvas.height - (60 / 100 * canvas.height));


				// P2 Score

				p5.image(Numbers[BoardData.Score.P2], canvasWidth / 2, canvas.height - (70 / 100 * canvas.height), canvasHeight / 12, canvasHeight / 12);




			}

	  }
	



  	return (
		<ReactP5Wrapper sketch={sketch} />
	);
}

export default ScoreGame;