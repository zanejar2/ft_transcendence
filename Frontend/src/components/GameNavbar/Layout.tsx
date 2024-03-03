import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../../pages/Navbar/NavBar';
import Menu from '../../pages/Menu/Menu';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { userStore } from '../../store';
import { Socket, io } from 'socket.io-client';
import axios from 'axios';
import Particlebackground from '../../Particlebackground';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';

function Layout() {
    const {
        setUser,
        setIsLoggedIn,
        setSocketRef,
        setGameSocketRef,
        setIsconnected,
        socketRef,
        gameSocket
    } = userStore();


    const navigate = useNavigate();
    const location = useLocation();
    const showNavAndMenu = location.pathname !== '/game';
    const { setRedirectedFor2FA } = useAuthStore();



    const getUser = async () => {
        try {
            
            const res = await axios.get(`http://${import.meta.env.VITE_API_URI}/Users/profile`, {
                withCredentials: true
            });
            setUser(res.data);
        } catch (err) {

            setIsLoggedIn(true);
        }
    };

    useEffect(() => {
        getUser();
    }, []);


    useEffect(() => {
        if (!socketRef) return;
    }, [socketRef]);



    if (location.pathname != '/game') {
        gameSocket?.emit('isInGame', null);
    }


    useEffect(() => {
        socketRef?.on('gameRequest', (data: any) => {
            const accept = () => {
                socketRef?.emit('acceptRequest', data);
            };

            const reject = () => {
                socketRef?.emit('rejectRequest', null);
            };

            toast.info(
                <div className="flex flex-col justify-center items-center">
                    <div>Game Request</div>
                    <div className="flex justify-around gap-10 pt-2">
                        <button
                            className="w-[5.469vw] h-[2.448vw] flex-shrink-0 rounded-[0.356vw] bg-green-300 text-[#272727] md:text-[1.146vw] text-center font-[Poppins] hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                            onClick={accept}
                        >
                            Accept
                        </button>
                        <button
                            className="w-[5.469vw] h-[.448vw] flex-shrink-0 rounded-[0.356vw] bg-red-500 text-[#272727] md:text-[1.146vw] text-center font-[Poppins] hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                            onClick={reject}
                        >
                            Deny
                        </button>
                    </div>
                </div>,
                {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000, 
                    closeOnClick: true, 
                    onClose: () => reject()
                }
            );
        });

        socketRef?.on('redirectToGame', () => {
            navigate('/game');
        });
    }, [socketRef]);


    
    useEffect(() => {
        const tmpSocket = io(`http://${import.meta.env.VITE_API_URI}/chat`, {
            transports: ['websocket'],
            withCredentials: true
        });
        setSocketRef(tmpSocket);
    }, [setSocketRef]);


    useEffect(() => {
        const gameSocket = io(`ws://${import.meta.env.VITE_API_URI}/game`, {
            transports: ['websocket'],
            withCredentials: true
        });

        setGameSocketRef(gameSocket);
    }, [setGameSocketRef]);


    const loc = useRef('');
    loc.current = location.pathname;


    useEffect(() => {
            
            socketRef?.on('user connected', () => {
                if (loc.current != '/game')
                {
                    setIsconnected(true);
                }
            });

            return () => {
                socketRef?.off('user connected');
            };
        
    }, [socketRef]);


    return (
        <div className="flex flex-col">
            {/* < Particlebackground /> */}
            <NavBar />
            <div
                className={`flex ${showNavAndMenu ? 'justify-around mt-3' : ''
                    }`}
            >
                {showNavAndMenu && <Menu />}
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
