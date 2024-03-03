import MatchHistory from './MatchHistory';
import { Key, useEffect, useState } from 'react';

import { matchAnalyticsType, matchStore, userStore } from '../../store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { matchHistoryProps } from '../../interfaces/matchHistoryProps';
import { userProps } from '../../interfaces/userProps';

function MatchHistoryComponent() {
    const { user } = userStore();
    const [matchData, setMatchHistory] = useState<matchHistoryProps[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `http://${import.meta.env.VITE_API_URI}/Users/history/${user?.login}`,
                    { withCredentials: true }
                );
                setMatchHistory(res.data.MatchHistory);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user?.login]);

    return (
        <div className="flex flex-col items-center justify-between w-[26.042vw] h-[21vw] ">
            <div className="mt-6">
                <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">
                    Match History
                </p>
            </div>
            <div className="w-[20.5vw] h-[0.104vw] mb-1 bg-[#DDDDDD]"></div>
            <div className="h-[12vw] mb-16">
                <div className="h-[14vw] w-[23.438vw] flex flex-col items-center snap-y snap-mandatory overflow-scroll">
                    {matchData
                        .reverse()
                        .map((match: matchHistoryProps, index: Key) => (
                            <MatchHistory key={index} matchData={match} />
                        ))}
                </div>
            </div>
        </div>
    );
}

export default MatchHistoryComponent;
