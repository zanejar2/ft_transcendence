import axios from 'axios';
import Particlebackground from '../../Particlebackground';
import shield from './assets/shield.svg';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../../store';
import { useAuthStore } from '../../store/authStore';

const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    let input = event.currentTarget;
    let inputValue = input.value;
    input.value = inputValue ? parseInt(inputValue).toString().slice(0, 1) : '';

    let nextInput = input.nextElementSibling as HTMLInputElement;
    if (nextInput && input.value.length) {
        nextInput.focus();
    } else if (!input.value.length) {
        let prevInput = input.previousElementSibling as HTMLInputElement;
        if (prevInput) {
            prevInput.focus();
        }
    }
};

function TwoFAComponent() {
    const ref = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { setRedirectedFor2FA } = useAuthStore();
    const sendNumbers = () => {
        if (ref.current) {
            const numbers = ref.current.value;
            if (numbers.length === 6) {
                axios
                    .post(
                        `http://${import.meta.env.VITE_API_URI}/auth/2fa/login`,
                        { number: numbers },
                        { withCredentials: true }
                    )
                    .then(() => {
                        setRedirectedFor2FA(true);
                        toast.success('Logged in successfully');
                        navigate('/home');
                    })
                    .catch(() => {
                        toast.error('Invalid code');
                    });
            }
        }
    };

    return (
        <div className="w-[31.458vw] h-[30.156vw] flex flex-col justify-around items-center rounded-[0.521vw] bg-[linear-gradient(134deg,_rgba(9,_20,_31,_0.51)_-2.2%,_rgba(9,_20,_31,_0.50)_100.15%)]">
            <div className="w-[25vw]">
                <img
                    className="w-[3.125vw] h-[3.125vw]"
                    src={shield}
                    alt="shield"
                />
            </div>
            <div className="w-[25vw]">
                <p className="text-[#9DB2BF] md:text-[1.546vw] text-[1.146vw] text-start font-[Poppins] not-italic font-semibold leading-[normal]">
                    Set up 2 factor auth (2FA)
                </p>
            </div>
            <div className="flex flex-col justify-between items-center h-[7vw]">
                <div className="w-[25vw]">
                    <p className="text-[#9DB2BF] md:text-[0.777vw] text-[0.777vw] text-start font-[Poppins] not-italic font-semibold leading-[normal]">
                        Verification Code
                    </p>
                </div>
                <div className="space-x-3.5">
                    {/* <input className="w-[2.904vw] h-[2.904vw] rounded-[0.156vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.246vw] text-[1.246vw] text-center font-[Poppins]"
            type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} onInput={handleInput} autoFocus />
          <input className="w-[2.904vw] h-[2.904vw] rounded-[0.156vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.246vw] text-[1.246vw] text-center font-[Poppins]"
            type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} onInput={handleInput} />
          <input className="w-[2.904vw] h-[2.904vw] rounded-[0.156vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.246vw] text-[1.246vw] text-center font-[Poppins]"
            type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} onInput={handleInput} />
          <input className="w-[2.904vw] h-[2.904vw] rounded-[0.156vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.246vw] text-[1.246vw] text-center font-[Poppins]"
            type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} onInput={handleInput} />
          <input className="w-[2.904vw] h-[2.904vw] rounded-[0.156vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.246vw] text-[1.246vw] text-center font-[Poppins]"
            type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} onInput={handleInput} />
          <input className="w-[2.904vw] h-[2.904vw] rounded-[0.156vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.246vw] text-[1.246vw] text-center font-[Poppins]"
            type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} onInput={handleInput} /> */}
                    <input
                        className="w-[20vw] h-[2.904vw] rounded-[0.156vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.246vw] text-[1.246vw] text-center font-[Poppins]"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        ref={ref}
                        onChange={sendNumbers}
                    />
                </div>
                <div className="w-[25vw]">
                    <span className="text-[#9DB2BF] md:text-[0.777vw] text-[0.777vw] text-start font-[Poppins] not-italic font-medium capitalize">
                        I didn’t receive a code ?{' '}
                    </span>
                    <button className="text-[#c0d5e2] text-[0.829vw] font-semibold font-['Poppins'] underline capitalize">
                        Click to resend{' '}
                    </button>
                </div>
            </div>
            <div className="flex justify-around w-[27vw]">
                <button className="w-[10.469vw] h-[2.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]">
                    cancel{' '}
                </button>
                <button className="w-[10.469vw] h-[2.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]">
                    verify{' '}
                </button>
            </div>
        </div>
    );
}

function TwoFA() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Particlebackground />
            <TwoFAComponent />
        </div>
    );
}

export default TwoFA;
