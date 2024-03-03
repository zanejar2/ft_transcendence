import { useRef, useState } from 'react';
import UpdateUserName from './assets/Vector.svg';
import { toast } from 'react-toastify';
import { AploadUserNameProps } from '../../interfaces/AploadUserNameProps';
import { userStore } from '../../store';
import axios from 'axios';

function AploadUserName({ data }: AploadUserNameProps) {
    const { user, setUser } = userStore();
    // const [isEditable, setIsEditable] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const refLogin = useRef<HTMLInputElement | null>(null);

    const handleInputChange = async () => {
        const v = refLogin?.current?.value.substring(0, 10) as string;
        if (v == 'Bot') {
            toast.error('unvalid username');
            return;
        }
        const data = {
            login: v
        };
        if (v) {
            setIsModalOpen(false);
            // setIsEditable(false);
            try {
                // Save the username to the backend here
                await axios.patch(
                    `http://${import.meta.env.VITE_API_URI}/Users/${user?.login}`,
                    data,
                    { withCredentials: true }
                );
                setUser({ ...user!, login: v });
            } catch (err) {
                toast.error('username already exists');
            }
        } else {
            toast.error('Username cannot be empty');
        }
    };

    const enableEditing = () => {
        setIsModalOpen(true);
    };

    const EditUsernameModal = () => (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflo h-full w-full"
            id="my-modal"
        >
            <div className="relative top-20 mx-auto p-5 w-[30vw] h-[16vw] rounded-[0.521vw] bg-[linear-gradient(134deg,_rgba(9,_20,_31,_0.51)_-2.2%,_rgba(9,_20,_31,_0.50)_100.15%)]">
                <div className="mt-3 text-center">
                    <h3 className="text-[#bcd0dc] md:text-[1.546vw] text-[1.146vw] text-start font-[Poppins] not-italic font-semibold leading-[normal]">
                        Edit Username
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        <input
                            ref={refLogin}
                            type="text"
                            defaultValue={data.login}
                            className="w-[20.904vw] h-[2.904vw] rounded-[0.356vw] bg-[rgba(206,223,234,0.95)] text-[#272727] md:text-[1.246vw] text-[1.246vw] text-center font-[Poppins]"
                        />
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={handleInputChange}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            DONE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex justify-end gap-3 ">
            <h4 className="text-[1.3vw] text-center font-['Poppins'] font-bold bg-clip-text text-transparent bg-[linear-gradient(144deg,_rgba(221,_221,_221,_0.98)_-16.98%,_rgba(221,_221,_221,_0.98)_21.3%,_rgba(200,_75,_49,_0.98)_149.96%)] capitalize">
                {data.login}
            </h4>
            <button
                className="w-[1.302vw] hover:scale-110 transition duration-100 "
                onClick={enableEditing}
            >
                <img className="w-[1.042vw]" src={UpdateUserName} alt="Edit" />
            </button>

            {isModalOpen && <EditUsernameModal />}
        </div>
    );
}

export default AploadUserName;
