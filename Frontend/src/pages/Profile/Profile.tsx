import Menu from '../Menu/Menu';
import NavBar from '../Navbar/NavBar';
import Particlebackground from '../../Particlebackground';
import MatchHistory from '../Settings/MatchHistory';
import UserStats from './UserStats';
import UserWinLossRate from './UserWinLossRate';
import { matchAnalyticsType, matchStore, userStore } from '../../store';
import { Key, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UsersAchievementState from './UsersAchievementState';
import { userProps } from '../../interfaces/userProps';
import AddFriendBlock from './AddFriendBlock';
import { matchHistoryProps } from '../../interfaces/matchHistoryProps';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import AchievementState from '../Settings/AchievementState';

function UserName({ data }: { data: { UserName: string } }) {
    return (
        <>
            <p className="w-[10.417vw] h-[2vw] text-center text-[1.5vw] font-bold font-['Poppins'] bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)] capitalize">
                {data.UserName}
            </p>
        </>
    );
}

function UserAvatar({ data }: { data: { avatr: string } }) {
    return (
        <>
            <img
                className="w-[6.771vw] h-[6.771vw] rounded-full"
                src={data.avatr}
                alt="/"
            />
        </>
    );
}

function UserProfile({ data }: { data: { users: userProps } }) {
    const [UserHistory, setserHistory] = useState<matchHistoryProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `http://${import.meta.env.VITE_API_URI}/Users/history/${data.users.login}`,
                    { withCredentials: true }
                );
                setserHistory(res.data.MatchHistory);
            } catch (err) {
                console.error(err);
                toast.error('error fetching match history1');
            }
        };
        fetchData();
    }, [data.users.login]);

    return (
        <div className="h-[41.146vw] w-[39.063vw] flex flex-col items-center rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <div className="w-[13.021vw] h-[10.417vw] flex flex-col items-center justify-between mt-6">
                <div>
                    <UserAvatar data={{ avatr: data.users.picture }} />
                </div>
                <div className="w-[10.417vw] h-[2vw] mb-3">
                    <UserName data={{ UserName: data.users.login }} />
                </div>
            </div>
            <div className="w-[25.438vw] flex justify-between items-center">
                <ProgressBar value={(data.users.level / 1200) * 100} />
            </div>
            <div className="w-[33.854vw] h-[5vw] mt-4 flex justify-center ">
                <UserWinLossRate data={data.users} UserHistory={UserHistory} />
            </div>
            <div className="w-[36.458vw] h-[17vw] flex flex-col justify-start items-center">
                <UserStats data={data.users} UserHistory={UserHistory} />
                <div className="w-[30.5vw] h-[0.104vw] mb-1 bg-[#DDDDDD]"></div>
            </div>
        </div>
    );
}

function MatchHistoryComponents({ data }: { data: { users: userProps } }) {
    const [matchData, setMatchHistory] = useState<matchHistoryProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `http://${import.meta.env.VITE_API_URI}/Users/history/${data?.users.login}`,
                    { withCredentials: true }
                );
                setMatchHistory(res.data.MatchHistory);
            } catch (err) {
                console.error(err);
                toast.error('error fetching match history');
            }
        };
        fetchData();
    }, []);

    return (
        <div className="h-[41.146vw] w-[26.042vw] flex flex-col items-center rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <div className="flex flex-col items-center justify-between w-[26.042vw] h-[21vw] ">
                <div className="mt-6">
                    <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">
                        Match History
                    </p>
                </div>
                <div className="w-[20.5vw] h-[0.104vw] mb-1 bg-[#DDDDDD]"></div>
                <div className="h-[12vw] mb-16">
                    <div className="h-[34vw] w-[23.438vw] flex flex-col items-center snap-y snap-mandatory overflow-scroll">
                        {matchData
                    
                            .map((match: matchHistoryProps, index: Key) => (
                                <MatchHistory key={index} matchData={match} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FriendsAndAchievements({
    data: { users }
}: {
    data: { users: userProps };
}) {
    return (
        <div className="h-[41.146vw] flex flex-col justify-between">
            {/* <FriendsState data={{ user }} /> */}
            {/* <UsersAchievementState data={{ user }} /> */}
            <AddFriendBlock username={users.login} />
            <AchievementState
                win={users?.Wins!}
                lose={users?.Lost!}
                matchPlayed={users?.match!}
            />
        </div>
    );
}

export function ProfileComponent() {
    const { username } = useParams();
    const { user } = userStore();
    const [relation, setRelation] = useState<userProps>();

    const [users, setUser] = useState<userProps>({
        user: '',
        id: 0,
        intraId: '',
        login: '',
        email: '',
        username: '',
        picture: '',
        status: '',
        level: 0,
        inGame: false,
        Wins: 0,
        Lost: 0,
        match: 0,
        achievements: [],
        friends: [],
        blockedBy: [],
        blockedUsers: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `http://${import.meta.env.VITE_API_URI}/Users/profile/${username}`, {
                        withCredentials: true
                    }
                );
                const data = res.data;
                setUser(data);
            } catch (err) {
                toast.error('user not found');
                navigate('/NotFound');
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const relationship = async () => {
            try {
                const res = await axios.get(
                    `http://${import.meta.env.VITE_API_URI}/Users/profile/${user?.login}`,
                    {
                        withCredentials: true
                    }
                );
                setRelation(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        relationship();
    }, [user?.login]);

    if (relation?.blockedUsers) {
        (relation?.blockedUsers).map((blocked: userProps) =>
            blocked.login === username ? navigate('/NotFound') : null
        );
    }

    if (relation?.blockedBy) {
        (relation?.blockedBy).map((blocked: userProps) =>
            blocked.login === username ? navigate('/NotFound') : null
        );
    }

    return (
        <>
            {users.login && (
                <div className="flex justify-between w-[89.583vw] items-center">
                    <FriendsAndAchievements data={{ users }} />
                    <UserProfile data={{ users }} />
                    <MatchHistoryComponents data={{ users }} />
                </div>
            )}
        </>
    );
}
