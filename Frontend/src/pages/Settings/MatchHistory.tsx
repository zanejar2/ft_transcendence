import { useEffect, useState } from 'react';
import { matchHistoryProps } from '../../interfaces/matchHistoryProps';
import axios from 'axios';
import { userProps } from '../../interfaces/userProps';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Bot from '../assets/Bot.svg';

function MatchHistory({ matchData }: { matchData: any }) {
    const [loserAvatar, setLoserAvatar] = useState<userProps>();
    const [winnerAvatar, setWinnerAvatar] = useState<userProps>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (matchData.WinnerName != 'Bot') {
                    const res2 = await axios.get(
                        `http://${import.meta.env.VITE_API_URI}/Users/profile/${matchData.WinnerName}`,
                        {
                            withCredentials: true
                        }
                    );
                    setWinnerAvatar(res2.data);
                }

                if (matchData.LoserName != 'Bot') {
                    const res3 = await axios.get(
                        `http://${import.meta.env.VITE_API_URI}/Users/profile/${matchData.LoserName}`,
                        {
                            withCredentials: true
                        }
                    );
                    setLoserAvatar(res3.data);
                }
            } catch (data) {}
        };
        fetchData();
    }, []);

    return (
        <div className="flex items-center justify-around w-[20.833vw] mt-2 py-1 rounded-[0.5vw] hover:bg-slate-700 hover:scale-105 transition duration-100 hover:[box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <Link to={`/profile/${matchData.WinnerName}`}>
                <button className="flex justify-between items-center w-[8vw]">
                    <img
                        className="w-[2.604vw] h-[2.604vw] rounded-full"
                        src={
                            matchData.GameMode == 'Practice' &&
                            winnerAvatar?.picture == undefined
                                ? Bot
                                : winnerAvatar?.picture
                        }
                        alt="avatar"
                    />
                    <p className="text-[#DDDDDD] w-[4vw] text-[1vw]  md:text-[0.8vw] text-center font-['Poppins'] font-medium capitalize">
                        {matchData.WinnerName}
                    </p>
                    <p className="text-[#DDDDDD] w-[0.677vw] text-[1vw] md:text-[0.8vw] text-center font-['Poppins'] font-medium">
                        {matchData.WinnerScore}
                    </p>
                </button>
            </Link>
            <div className="w-[0.104vw] h-[1.823vw] rounded-[2.292vw] bg-[#DDDDDD]"></div>
            <Link to={`/profile/${matchData.LoserName}`}>
                <button className="flex justify-between  items-center w-[8vw]">
                    <p className="text-[#DDDDDD] w-[0.677vw] text-[1vw] md:text-[0.8vw] text-center font-['Poppins'] font-medium">
                        {matchData.LoserScore}
                    </p>
                    <p className="text-[#DDDDDD] w-[4vw] text-[1vw] md:text-[0.8vw] text-center font-['Poppins'] font-medium capitalize">
                        {matchData.LoserName}
                    </p>
                    <img
                        className="w-[2.604vw] h-[2.604vw] rounded-full"
                        src={
                            matchData.GameMode == 'Practice' &&
                            loserAvatar?.picture == undefined
                                ? Bot
                                : loserAvatar?.picture
                        }
                        alt="avatar"
                    />
                </button>
            </Link>
        </div>
    );
}
export default MatchHistory;
