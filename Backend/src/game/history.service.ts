/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Room } from './class/room.class';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerState } from './interfaces/Player.State.interface';


@Injectable()
export class HistoryService {

	constructor(
		private readonly prismaService:PrismaService
	){}


	/*
		// Match History Data //
			--> winner id
			--> loser id
			--> winner name
			--> loser name
			--> winner score
			--> loser score
		///////////////////////
	*/
	// Create New Match History For Unique User
	async Create(
		UserId:number,
		WinnerId:number, LoserId:number,
		Winner:PlayerState, Loser:PlayerState,
		GameState:string
	)
	{
		
		if (GameState == 'out')
		{
			await this.prismaService.user.update({
				where: { id: UserId },
				data: {
				  inGame: false,
				  requestGameToken: null
				},
			});
		}
		else
		{
			await this.prismaService.history.create({
				data: {
					user: {
						connect: {
							id: UserId,
						},
					},
				WinnerId: WinnerId,
				LoserId: LoserId,
				WinnerName: Winner.name,
				LoserName: 	Loser.name,
				WinnerScore: Winner.score,
				LoserScore: Loser.score,
				GameMode: GameState,
				},
			})

			// Players Data
			const WinnerData = await this.prismaService.user.findUnique({
				where: {
				  id: WinnerId,
				},
			});
			const LoserData = await this.prismaService.user.findUnique({
				where: {
				  id: LoserId,
				},
			});


			// Update Player's Level
			if ((GameState == 'Normal' || GameState == 'Disconnect') && UserId == WinnerId)
			{
				const newLevel = WinnerData.level + (((Winner.score - Loser.score) + 2) * 0.5);
				const Wins 	   = WinnerData.Wins + 1;
				const Lost 	   = LoserData.Lost + 1;
				// Add Level to Winner
				await this.prismaService.user.update({
					where: {
						id: WinnerId
					},
					data:{
						level: newLevel,
						Wins: Wins
					}
				});

				await this.prismaService.user.update({
					where: {
						id: LoserId
					},
					data:{
						Lost: Lost
					}
				});
			}


			// Check for Collected Acheivements




			// Reset Token so other players can invite him
			if (GameState == 'Disconnect')
			{
				await this.prismaService.user.update({
					where: { id: UserId },
					data: {
					  inGame: false,
					  requestGameToken: null
					},
				});
			}
			else if (GameState == 'Practice' || GameState == 'Practice-Reflex')
			{
				await this.prismaService.user.update({
					where: { id: UserId },
					data: {
						inGame: false,
					  	requestGameToken: null
					},
				});
			}
			else
			{
				await this.prismaService.user.update({
					where: { id: UserId },
					data: {
						inGame: false,
					  	requestGameToken: null
					},
				});
			}
		}
	}

	async Delete(UserId:string)
	{
		
	}

}