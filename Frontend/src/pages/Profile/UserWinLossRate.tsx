import { useEffect, useState } from 'react';
import { userProps } from '../../interfaces/userProps';
import axios from 'axios';
import { toast } from 'react-toastify';
import { matchHistoryProps } from '../../interfaces/matchHistoryProps';

interface UserWinLossRateProps {
    data: userProps;
    UserHistory: matchHistoryProps[];
}

const UserWinLossRate: React.FC<UserWinLossRateProps> = ({
    data,
    UserHistory
}) => {
    return (
        <div className="w-[26.042vw] h-[4.688vw] flex justify-between items-center">
            <div className="w-[5.208vw] h-[4.688vw] flex flex-col justify-around items-center">
                <p className="text-[1.3vw] text-center font-['Poppins'] font-bold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    MATCH
                </p>
                <p className="text-[1.3vw] text-center font-['Poppins'] font-semibold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    {UserHistory.length}
                </p>
            </div>
            <div className="w-[5.208vw] h-[4.688vw] flex flex-col justify-around items-center">
                <p className="text-[1.3vw] text-center font-['Poppins'] font-bold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    WIN
                </p>
                <p className="text-[1.3vw] text-center font-['Poppins'] font-semibold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    {data.Wins}
                </p>
            </div>
            <div className="w-[5.208vw] h-[4.688vw] flex flex-col justify-around items-center">
                <p className="text-[1.3vw] text-center font-['Poppins'] font-bold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    LOSS
                </p>
                <p className="text-[1.3vw] text-center font-['Poppins'] font-semibold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]">
                    {data.Lost}
                </p>
            </div>
        </div>
    );
};

export default UserWinLossRate;
