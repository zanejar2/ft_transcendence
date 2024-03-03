import HomeIcone from './assets/HomeIcon.svg';
import ExitIcone from './assets/ExitIcon.svg';
import ChatIcone from './assets/ChatIcon.svg';
import UserIcone from './assets/UserIcon.svg';
import SittingsIcone from './assets/SettingsIcon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { userStore } from '../../store';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

function Menu() {
    const {
        user,
        socketRef,
        isconnected,
        setSelectedAllRoom,
        setSelectedAllDms,
        setIsLoggedIn,
        setIsconnected
    } = userStore();
    const navigate = useNavigate();
    const { setRedirectedFor2FA } = useAuthStore();

    useEffect(() => {
        if (isconnected && socketRef) {
            socketRef.emit('getChannels');
            socketRef.on('getChannels', (data: any) => {
                setSelectedAllRoom(data);
            });
        }

        return () => {
            socketRef?.off('getChannels');
        };
    }, [socketRef, isconnected]);

    useEffect(() => {
        if (isconnected && socketRef) {
            socketRef.emit('getDms');
            socketRef.on('getDms', (data: any) => {
                setSelectedAllDms(data);
            });
        }
        return () => {
            socketRef?.off('getDms');
        };
    }, [socketRef, isconnected]);

    const logout = () => {
        axios
            .post(
                `http://${import.meta.env.VITE_API_URI}/Users/logout`,
                {},
                { withCredentials: true }
            )
            .then((res) => {
                navigate('/');
                setIsLoggedIn(true);
                setRedirectedFor2FA(false);
                setIsconnected(false);
            })
            .catch((error) => {
                console.log(
                    `MyError -> ${error.response.data.message}, ${error.response.data.error}, ${error.response.data.statusCode}`
                );
            });
    };

    return (
        <div className="w-[4.688vw] h-[41.146vw] flex flex-col items-center justify-between  rounded-[1.823vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <div className="flex h-[18.906vw] flex-col mt-16 justify-around items-center">
                <Link to="/Home">
                    <button>
                        <img
                            className="w-[1.40vw] hover:scale-125 transition-all"
                            src={HomeIcone}
                            alt="/"
                        />
                    </button>
                </Link>
                <Link to={`/profile/${user?.login}`}>
                    <button>
                        <img
                            className="w-[1.40vw] hover:scale-125 transition-all"
                            src={UserIcone}
                            alt="/"
                        />
                    </button>
                </Link>

                <Link to="/Chat">
                    <button
                        onClick={() => {
                            setSelectedAllRoom;
                            setSelectedAllDms;
                        }}
                    >
                        <img
                            className="w-[1.40vw] hover:scale-125 transition-all"
                            src={ChatIcone}
                            alt="/"
                        />
                    </button>
                </Link>

                <Link to="/Settings">
                    <button>
                        <img
                            className="w-[1.40vw] hover:scale-125 transition-all"
                            src={SittingsIcone}
                            alt="/"
                        />
                    </button>
                </Link>
            </div>
            <div className="mb-24">
                <Link to="/">
                    <button onClick={logout}>
                        <img
                            className="w-[1.40vw] hover:scale-125 transition-all"
                            src={ExitIcone}
                            alt="/"
                        />
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Menu;
