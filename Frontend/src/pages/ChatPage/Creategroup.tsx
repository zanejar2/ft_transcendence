import cross from './assets/cross.svg'
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { userStore } from '../../store';
import { toast } from 'react-toastify';

interface CreategroupProps {
    disablecreategroup: () => void;
}

function Creategroup({ disablecreategroup }: CreategroupProps) {

    const [selectedOption, setSelectedOption] = useState('public');
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const groupname = useRef<HTMLInputElement>(null);
    const passwordexist = useRef<HTMLInputElement>(null);
    const { socketRef, setSelectedAllRoom } = userStore()


    const handleOnChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedOption(event.target.value);
        setShowPasswordInput(event.target.value === 'protected');
    };

    const createGroupButton = () => {
        if (groupname && groupname.current) {
            const groupnamevalue = groupname.current.value;
            socketRef?.emit("createChannel", {
                name: groupnamevalue,
                type: selectedOption,
                password: passwordexist.current?.value
            })
            if (selectedOption === 'protected' && (passwordexist.current?.value === '' || passwordexist.current?.value === undefined)) {
                toast.error('Password is required for protected group')
            }
            else {
                disablecreategroup()
            }
        }
    }

    useEffect(() => {
        socketRef?.off("findAllNonDmChannels").on("findAllNonDmChannels", (data: any) => {
            setSelectedAllRoom(data);
        });
    }, [socketRef])

    return (
        <div>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-auto h-full w-full" id="my-modal">
                <div className="relative top-20 mx-auto p-5 w-[28.5vw] h-[23vw] rounded-[1.5vw] bg-slate-800">
                    <div className="flex flex-col justify-between items-center mb-6">
                        <button className="text-gray-400 hover:text-gray-300 pl-[22vw]"
                            onClick={disablecreategroup}>
                            <img src={cross} alt="/" />
                        </button>
                        <h2 className="text-[#9DB2BF] md:text-[1.5vw] text-[1.4vw] mb-2 text-start font-[Poppins] not-italic font-bold leading-[normal]">Customize your group</h2>
                        <h1 className="w-[20vw] text-[#9DB2BF] md:text-[0.9vw] text-[0.9vw] text-center font-[Poppins] not-italic font-smale leading-[normal]">give your new group a personality with a name</h1>
                    </div>
                    <div className="flex flex-col items-center mb-6">
                        <input
                            ref={groupname}
                            type="text"
                            placeholder="Group Name"
                            maxLength={10}
                            className='w-4/5 bg-[rgba(157,178,191,0.91)] rounded-[0.356vw] text-gray-900 md:text-[1.146vw] sm:text-[1.146vw] font-["poppins"] font-semibold pl-8 border-[#1e1e1e] py-2 mb-8 placeholder-gray-700'
                        />
                        <div className="flex flex-col items-center">
                            <div className="flex items-center mb-4">
                                {/* Public Radio */}
                                <label htmlFor="public" className="flex items-center cursor-pointer text-sm text-white ">
                                    <input
                                        id="public"
                                        type="radio"
                                        name="privacy"
                                        value="public"
                                        className="hidden peer"
                                        onChange={handleOnChange}
                                        checked={selectedOption === 'public'}
                                    />
                                    <span className="w-4 h-4 inline-block mr-2 rounded-full border border-gray-400 peer-checked:bg-gray-300"></span>
                                    Public
                                </label>
                                {/* Private Radio */}
                                <label htmlFor="private" className="flex items-center cursor-pointer text-sm text-white ml-6">
                                    <input
                                        id="private"
                                        type="radio"
                                        name="privacy"
                                        value="private"
                                        className="hidden peer"
                                        onChange={handleOnChange}
                                        checked={selectedOption === 'private'}
                                    />
                                    <span className="w-4 h-4 inline-block mr-2 rounded-full border border-gray-400 peer-checked:bg-gray-300"></span>
                                    Private
                                </label>


                                {/* Protected Radio */}
                                <label htmlFor="protected" className="flex items-center cursor-pointer text-sm text-white ml-6">
                                    <input
                                        id="protected"
                                        type="radio"
                                        name="privacy"
                                        value="protected"
                                        className="hidden peer"
                                        onChange={handleOnChange}
                                        checked={selectedOption === 'protected'}
                                    />
                                    <span className="w-4 h-4 inline-block mr-2 rounded-full border border-gray-400 peer-checked:bg-gray-300"></span>
                                    Protected
                                </label>
                            </div>

                            {showPasswordInput && (
                                <input
                                    ref={passwordexist}
                                    type="password"
                                    maxLength={10}
                                    placeholder="Password..."
                                    className='w-4/5 bg-[rgba(157,178,191,0.91)] rounded-[0.356vw] text-gray-900 md:text-[1.146vw] sm:text-[1.146vw] font-["Poppins"] font-semibold pl-8 border-[#1e1e1e] py-2 placeholder-gray-700'
                                />
                            )}
                        </div>
                        {/* <input type="password" placeholder="Password..." className='w-4/5 bg-[rgba(157,178,191,0.91)] rounded-[0.356vw] text-gray-900 md:text-[1.146vw] sm:text-[1.146vw] font-["poppins"] font-semibold pl-8 border-[#1e1e1e] py-2 mb-4 placeholder-gray-700' /> */}
                    </div>
                    <button className="w-5/12 h-11 py-2 ml-[7.292vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-gray-800 md:text-[0.938vw] text-[1vw] text-center font-[Poppins] font-bold hover:bg-slate-950 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        onClick={createGroupButton}>
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Creategroup