import NavBar from '../Navbar/NavBar';
import Menu from '../Menu/Menu';
import akaouan from './assets/akaouan.svg';
import aainhaja from './assets/aainhaja.svg';
import tableanimation from './assets/animation.gif';
import playicon from './assets/playicon.svg';
import fireAvatar from './assets/fireAvatar1.svg';
import pixel from './assets/pixelbutton.svg';
import botmode from './assets/botMode.svg';
import { Link } from 'react-router-dom';
import Particlebackground from '../../Particlebackground';
import axios from 'axios';
import { useState, useEffect, Key } from 'react';
import { BestPlayerProps } from '../../interfaces/BestPlayerProps';
import MatchHistoryComponent from '../Settings/MatchHistoryComponent';
import { userStore } from '../../store';
import { matchHistoryProps } from '../../interfaces/matchHistoryProps';
import MatchHistory from '../Settings/MatchHistory';
import { useNavigate } from 'react-router-dom';

function MainHome() {
    const navigate = useNavigate();

    return (
        <div className="flex h-[41.146vw] flex-col justify-between">
            <div className="flex flex-col justify-around items-center w-[64.667vw] h-[41.146vw] rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
                <div className="w-[61.844vw] h-[27.021vw] rounded-[2.292vw] bg-[linear-gradient(351deg,_rgba(24,_38,_56,_0.60)_-35.95%,_rgba(62,_78,_99,_0.60)_25.01%,_rgba(129,_127,_120,_0.51)_77.59%,_rgba(200,_75,_49,_0.60)_149.62%)] [box-shadow:0px_-1px_49px_5px_rgba(158,_177,_197,_0.40)]">
                    <div className="flex">
                        <img
                            className="w-[37.875vw] h-[27.021vw] pl-4"
                            src={tableanimation}
                            alt="/"
                        />
                        <div className="flex flex-col items-center justify-around w-[64.844vw] h-[28.021vw]">
                            <p className="w-[17.865vw] h-[17.396vw] mt-5 text-center font-['Poppins'] text-[4.740vw] not-italic font-bold leading-[121.5%] bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)]  capitalize">
                                let the game begin!
                            </p>
                            <div className="mb-4">
                                <span className="text-neutral-200 text-[0.729vw] font-light font-['Poppins'] capitalize">
                                    click{' '}
                                </span>
                                <span className="text-neutral-200 text-[0.729vw] font-semibold font-['Poppins'] capitalize">
                                    play{' '}
                                </span>
                                <span className="text-neutral-200 text-[0.729vw] font-light font-['Poppins'] capitalize">
                                    to start a random game !
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    navigate('/game', {
                                        state: { gameMode: 'Normal' }
                                    });
                                }}
                            >
                                <div className="w-[12.344vw] h-[3.125vw] left-0 top-0 bg-slate-700 rounded-[2.292vw] mb-9 relative hover:bg-slate-800 hover:scale-105 transition duration-100 ">
                                    <div>
                                        <div className="w-[3.299vw] left-[4.363vw] top-[0.521vw] absolute text-center text-neutral-200 text-[1.354vw] font-bold font-['Poppins'] capitalize">
                                            play
                                        </div>
                                        <img
                                            className="w-[1.224vw] h-[1.302vw] left-[10.322vw] top-[0.885vw] absolute"
                                            src={playicon}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-around w-[63.844vw] h-[10.417vw]">
                    <div className="w-[19.271vw] h-[10.417vw] flex items-center justify-center rounded-[2.292vw] bg-[linear-gradient(180deg,_rgba(200,_75,_49,_0.42)_0%,_rgba(200,_75,_49,_0.42)_0%,_rgba(39,_55,_77,_0.42)_0.01%,_rgba(236,_219,_186,_0.42)_100%)] [box-shadow:0px_-1px_26px_-2px_rgba(158,_177,_197,_0.30)]">
                        <div className="w-[10.417vw] h-[5.344vw] flex flex-col items-center justify-around">
                            <p className="w-[10vw] text-center text-neutral-200 text-[0.7vw] font-semibold font-['Poppins'] capitalize">
                                Test Your Speed, <br />
                                Ignite Your Reflexes!
                            </p>
                            <button
                                className="w-[5.885vw] h-[2vw] flex items-center justify-center bg-slate-700 bg-opacity-80 rounded-[0.677vw] border border-slate-500 border-opacity-60  hover:bg-slate-800 hover:scale-105 transition duration-100 "
                                onClick={() => {
                                    navigate('/game', {
                                        state: { gameMode: 'Practice-Reflex' }
                                    });
                                }}
                            >
                                <p className="text-[0.677vw] text-neutral-200 font-normal font-['Poppins'] capitalize">
                                    start now !
                                </p>
                            </button>
                        </div>
                        <img className="h-[10vw]" src={fireAvatar} alt="/" />
                    </div>
                    <div className="w-[19.271vw] h-[10.417vw] flex items-center justify-center rounded-[2.292vw] bg-[linear-gradient(180deg,_rgba(200,_75,_49,_0.42)_0%,_rgba(200,_75,_49,_0.42)_0%,_rgba(39,_55,_77,_0.42)_0.01%,_rgba(236,_219,_186,_0.42)_100%)] [box-shadow:0px_-1px_26px_-2px_rgba(158,_177,_197,_0.30)]">
                        <button
                            className="w-[16.667vw] h-[10.156vw] flex items-center hover:scale-105 transition duration-100"
                            onClick={() => {
                                navigate('/game', {
                                    state: { gameMode: 'Reflex' }
                                });
                            }}
                        >
                            <img className="mt-2" src={pixel} alt="/" />
                        </button>
                    </div>
                    <div className="w-[19.271vw] h-[10.417vw] flex items-center rounded-[2.292vw] bg-[linear-gradient(180deg,_rgba(200,_75,_49,_0.42)_0%,_rgba(200,_75,_49,_0.42)_0%,_rgba(39,_55,_77,_0.42)_0.01%,_rgba(236,_219,_186,_0.42)_100%)] [box-shadow:0px_-1px_26px_-2px_rgba(158,_177,_197,_0.30)]">
                        <div className="w-[10.417vw] h-[5.344vw] flex flex-col items-center justify-around">
                            <p className="w-[10vw] text-center text-neutral-200 text-[0.7vw] font-semibold font-['Poppins'] capitalize">
                                Sharpen Your Skills, Challenge the Machine!{' '}
                            </p>
                            <button
                                className="w-[5.885vw] h-[2vw] flex items-center justify-center bg-slate-700 bg-opacity-80 rounded-[0.677vw] border border-slate-500 border-opacity-60  hover:bg-slate-800 hover:scale-105 transition duration-100 "
                                onClick={() => {
                                    navigate('/game', {
                                        state: { gameMode: 'Practice' }
                                    });
                                }}
                            >
                                <p className="text-[0.677vw] text-neutral-200 font-normal font-['Poppins'] capitalize">
                                    start now !
                                </p>
                            </button>
                        </div>
                        <img className="h-[9vw]" src={botmode} alt="/" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Nothing() {
    return (
        <div>
            <p className=" text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-smole capitalize">
                Latest Matches
            </p>
        </div>
    );
}

function BestPlayersStats({ data }: { data: BestPlayerProps }) {
    return (
        <Link to={`/profile/${data.login}`}>
            <div className="flex items-center justify-between w-[20.001vw] h-[3.125vw] py-4 mt-2.5 rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] hover:[box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
                <div className="pl-1.5">
                    <img
                        className="w-[2.604vw] h-[2.604vw] rounded-full"
                        src={data.picture}
                        alt="/"
                    />
                </div>
                <div>
                    <p className="text-[#DDDDDD] md:text-[0.9vw] text-[0.9vw] text-center font-['Poppins'] font-medium capitalize">
                        {data.login}
                    </p>
                </div>
                <div className="pr-5">
                    <p className="text-[#DDDDDD] w-[3.906vw] md:text-[0.9vw] text-[0.9vw] text-center font-['Poppins'] font-medium capitalize">
                        {data.level}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function Statistiques() {
    const { user } = userStore();
    const [matchData, setMatchHistory] = useState<matchHistoryProps[]>([]);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await axios.get(`http://${import.meta.env.VITE_API_URI}/Users`, {
                    withCredentials: true
                });
                setAllUsers(res.data);
            } catch (err) {
                
            }
        };
        fetchAllUsers();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user)
                {
                    const res = await axios.get(
                        `http://${import.meta.env.VITE_API_URI}/Users/history/${user?.login}`,
                        { withCredentials: true }
                    );
                    setMatchHistory(res.data.MatchHistory);
                }
            } catch (err) {
                // console.error(err);
            }
        };
        fetchData();
    }, [user?.login]);

    return (
        // Last match component
        <div className="flex flex-col h-[41.146vw] justify-between ">
            <div className="flex flex-col items-center justify-around w-[22.677vw] h-[18.5vw] rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
                <div className="mt-4">
                    <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">
                        Latest Matches
                    </p>
                </div>
                <div className="w-[18.5vw] h-[0.104vw] mt-1 bg-[#DDDDDD]"></div>
                <div className="flex flex-col justify-around h-[12vw] mb-3">
                    <div className="flex flex-col items-center justify-around w-[22.001vw] h-[12vw]  snap-y snap-mandatory overflow-scroll">
                        {matchData
                            .slice(-3)
                            .reverse()
                            .map((match: matchHistoryProps, index: Key) => (
                                <MatchHistory key={index} matchData={match} />
                            ))}
                    </div>
                </div>
            </div>

            {/* Best players component */}
            <div className="flex flex-col items-center justify-around w-[22.677vw] h-[21.4vw] rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
                <div className="mt-3">
                    <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">
                        best players
                    </p>
                </div>
                <div className="w-[18.5vw] h-[0.104vw] mb- bg-[#DDDDDD]"></div>
                <div className="flex flex-col justify-around h-[12vw] mb-9">
                    {allUsers.length === 0 ? (
                        <Nothing />
                    ) : (
                        allUsers
                            .sort((a: any, b: any) => b.level - a.level)
                            .slice(0, 4)
                            .map((player, key) => (
                                <BestPlayersStats key={key} data={player} />
                            ))
                    )}
                </div>
            </div>
        </div>
    );
}

function Home() {
    return (
        <div className="flex items-center">
            <div className="flex gap-5">
                <Statistiques />
                <MainHome />
            </div>
        </div>
    );
}

export default Home;
