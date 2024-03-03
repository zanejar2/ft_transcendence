import 'react-toastify/dist/ReactToastify.css';

import { userStore } from '../../store';

import Menu from '../Menu/Menu';
import NavBar from '../Navbar/NavBar';
import MatchHistoryComponent from './MatchHistoryComponent';
import Particlebackground from '../../Particlebackground';
import BlockAccountComponent from './BlockAccount';
import TwoFAComponent from './TwoFAComponent';
import AchievementDescription from './AchievementsDescriptionComponent';
import AploadAvatar from './AploadAvatar';
import AploadUserName from './AploadUserName';
import WinLossRate from './WinLossRate';
import Friends from './Friends';
import AchievementState from './AchievementState';
import ProgressBar from '../Profile/ProgressBar';
import UserWinLossRate from '../Profile/UserWinLossRate';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { matchHistoryProps } from '../../interfaces/matchHistoryProps';

function UserAccount() {
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
        <div className="h-[41.146vw] w-[39.063vw] flex flex-col justify-between items-center rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <div className="w-[13.021vw] h-[10.417vw] flex flex-col items-center justify-between mt-2">
                <div className="w-[7.813vw] h-[7.813vw]">
                    <AploadAvatar />
                </div>
                <div className="z-10">
                    <AploadUserName data={{ login: user?.login! }} />
                </div>
            </div>
            <div className=" w-[23.438vw] ">
                <ProgressBar value={(user?.level! / 1200) * 100} />
            </div>
            <div className="w-[33.854vw] flex justify-center ">
                <UserWinLossRate data={user!} UserHistory={UserHistory} />
            </div>
            <div className="w-[36.458vw] h-[22.5vw] flex flex-col justify-around items-start">
                <AchievementDescription win={user?.Wins!} lose={user?.Lost!} />
            </div>
        </div>
    );
}

function FriendsAchievement() {
    const { user } = userStore();

    return (
        <div className="h-[41.146vw] flex flex-col justify-between">
            <Friends />
            <AchievementState
                win={user?.Wins!}
                lose={user?.Lost!}
                matchPlayed={user?.match!}
            />
        </div>
    );
}

function MatchHestoryBlockAccount2FA() {
    return (
        <div className="h-[41.146vw] w-[26.042vw] flex flex-col items-center rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <MatchHistoryComponent />
            <BlockAccountComponent />
            <TwoFAComponent />
        </div>
    );
}

export function SettingsPage() {
    const { user } = userStore();
    return (
        <>
            {user?.login && (
                <div className="flex justify-between w-[89vw] items-center">
                    <FriendsAchievement />
                    <UserAccount />
                    <MatchHestoryBlockAccount2FA />
                </div>
            )}
        </>
    );
}
