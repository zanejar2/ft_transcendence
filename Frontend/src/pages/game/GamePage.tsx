import { useEffect, useRef, useState } from "react";
import Game from "./Game";
import loading from '../LoginPage/assets/nion.gif'
import './css/GameStyle.css'
import { Socket, io } from "socket.io-client";
import { canvasHeight, canvasWidth } from "./Game";
import ScoreGame from "./ScoreBoard";
import { useLocation } from "react-router-dom";
import { userStore } from "../../store";




function MatchMaking() {


	return (

		<div className="w-[70vw] h-[30vw] flex justify-center items-center">
			<img className="pl-80 pt-80" src={loading} />
		</div>

	);
}

let RoomId: string = '';


export default function GamePage() {

	const [gameStarted, setGameStarted] = useState(false);
	const { gameSocket } = userStore();

	const location = useLocation();

	const { gameMode } = location.state || {};



	const GameMode: string = gameMode; // Reflex , Normal , Practice, Practice-Reflex


	useEffect(() => {
		gameSocket?.emit("JoinRoom", {
			hCanvas: canvasHeight, wCanvas: canvasWidth, GameMode: GameMode
		});

	}, [])

	useEffect(() => {



		gameSocket?.on("GameStarted", (data) => {

			RoomId = data.RoomId;
			setGameStarted(true);
		})


		return () => {
			gameSocket?.off("GameStarted");
		}

	}, []);



	return (
		<>
			{gameStarted ? (
				<>
					<Game GameMode={GameMode} GameSocket={gameSocket} RoomId={RoomId} />
					<ScoreGame GameMode={GameMode} GameSocket={gameSocket} />
				</>
			) : (<MatchMaking />)}

		</>
	);
}
