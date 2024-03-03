import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useRef } from 'react';
import Logo from '../../assets/logo.svg';
import SearchIcon from './assets/SearchIcon.svg';
import Noti from './assets/Notification.svg';
import { userStore } from '../../store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function NavBar() {
    const { user } = userStore();
    const username = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleClick();
        }
    };

    const handleClick = async () => {
        if (username && username.current) {
            try {
                const userName = username.current.value;
                const res = await axios.get(
                    `http://${import.meta.env.VITE_API_URI}/Users/profile/${userName}`,
                    {
                        withCredentials: true
                    }
                );
                const data = res.data;
                username.current.value = '';
                navigate(`/profile/${data.login}`);
            } catch (error: any) {
                username.current.value = '';
                console.log(error);
                toast.error("This username doesn't exist");
            }
        }
    };

    return (
        <div className="w-full h-[4.688vw] flex items-center justify-between">
            <div className="px-8">
                <Link to="/home">
                    <img className="w-[7vw]" src={Logo} alt="/" />
                </Link>
            </div>
            <div className="w-[75vw] flex items-center justify-between">
                <div className="ml-[8.7vw] flex flex-row items-center relative ">
                    <input
                        className='w-[21.615vw] h-[2.6vw] mt-2 rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)] text-[#DDDDDD] md:text-[0.938vw] sm:text-[0.938vw] font-["poppins"] font-normal pl-8 hover:border border-[#DDDDDD]'
                        type="text"
                        ref={username}
                        onKeyDown={handleKeyDown}
                        placeholder="Search..."
                    />
                    <img
                        className="absolute w-[1.40vw] left-[18.750vw] mt-2 "
                        src={SearchIcon}
                        alt="/"
                    />
                </div>
                <div className="pr-8">
                    <Link to="/Settings">
                        <img
                            className="w-[4.208vw] h-[4.208vw]  rounded-full"
                            src={user?.picture}
                            alt="/"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
