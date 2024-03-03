import { useEffect, useState } from 'react';
import { AploadUserNameProps } from '../../interfaces/AploadUserNameProps';
import axios from 'axios';
import { matchHistoryProps } from '../../interfaces/matchHistoryProps';
import { toast } from 'react-toastify';
import { userStore } from '../../store';

function WinLossRate() {
    const { user } = userStore();
    const [UserHistory, setserHistory] = useState<matchHistoryProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `http://${import.meta.env.VITE_API_URI}/Users/history/${user?.login}`,
                    { withCredentials: true }
                );
                setserHistory(res.data.MatchHistory);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user?.login]);

    return (
        <div className="w-[26.042vw] h-[4vw] flex justify-between items-center">
            <div className="w-[5.208vw] h-[4.688vw] flex flex-col justify-around items-center">
                <p className="text-[1.2vw] text-center font-['Poppins'] font-bold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    MATCH
                </p>
                <p className="text-[1.2vw] text-center font-['Poppins'] font-semibold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    {UserHistory.length}
                </p>
            </div>
            <div className="w-[5.208vw] h-[4.688vw] flex flex-col justify-around items-center">
                <p className="text-[1.2vw] text-center font-['Poppins'] font-bold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    WIN
                </p>
                <p className="text-[1.2vw] text-center font-['Poppins'] font-semibold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    {user?.Wins}
                </p>
            </div>
            <div className="w-[5.208vw] h-[4.688vw] flex flex-col justify-around items-center">
                <p className="text-[1.2vw] text-center font-['Poppins'] font-bold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    LOSS
                </p>
                <p className="text-[1.2vw] text-center font-['Poppins'] font-semibold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    {user?.Lost}
                </p>
            </div>
        </div>
    );
}

export default WinLossRate;
