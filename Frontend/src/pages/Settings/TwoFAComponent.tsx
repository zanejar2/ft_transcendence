import { useNavigate } from 'react-router-dom';

import key_switch_lock from './assets/switch_lock.svg';
import key_switch_unlock from './assets/switch_unlock.svg';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { userStore } from '../../store';
import axios from 'axios';

function TwoFAComponent() {
    const navigate = useNavigate();
    const { user } = userStore();
    const [is2FAEnabled, setIs2FAEnabled] = useState(user?.ifauthenficate);

    const handleToggle2FA = () => {
        if (!is2FAEnabled) {
            navigate('/QRCode');
        } else {
            {
                axios
                    .post(
                        `http://${import.meta.env.VITE_API_URI}/auth/2fa/turn-off`,
                        {},
                        { withCredentials: true }
                    )
                    .then(() => {
                        toast.success('2FA is disabled');
                    })
                    .catch(() => {
                        toast.error('2FA is already disabled');
                    });
            }
        }
        setIs2FAEnabled(!is2FAEnabled);
    };

    return (
        <div className="w-[21.615vw] h-[3.5vw] flex justify-around items-center rounded-[1vw] bg-[rgba(157,_178,_191,_0.35)] text-slate-700 text-[1.1vw] text-center font-['Poppins'] font-semibold capitalize hover:text-[#DDDDDD] hover:hover:bg-slate-700 hover:scale-105 transition duration-100 ">
            <div className="ml-2">
                <p>enable / disable 2FA :</p>
            </div>
            <div className=" mt-3">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={is2FAEnabled}
                        onChange={handleToggle2FA}
                    />
                    <div className="group peer ring-0 bg-rose-500  rounded-full outline-none duration-300 after:duration-300 w-[2.95vw] h-[1.458vw] shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gray-50 after:h-[1.250vw] after:w-[1.250vw] after:top-[0.104vw] after:left-[0.104vw] after:flex after:justify-center after:items-center peer-checked:after:translate-x-7 peer-hover:after:scale-95">
                        <img
                            className="absolute left-7 stroke-gray-900 h-[1.458vw]"
                            src={key_switch_lock}
                            alt="/"
                        />
                        <img
                            className="absolute stroke-gray-900 h-[1.458vw]"
                            src={key_switch_unlock}
                            alt="/"
                        />
                    </div>
                </label>
            </div>
        </div>
    );
}

export default TwoFAComponent;
