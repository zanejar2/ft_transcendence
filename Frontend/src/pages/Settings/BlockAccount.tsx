import { useEffect, useState } from 'react';
import { userStore } from '../../store';
import axios from 'axios';
import { userProps } from '../../interfaces/userProps';
import { toast } from 'react-toastify';

function BlockedPeople({ blocked }: { blocked: userProps }) {
    const { user } = userStore();

    const unblock = async () => {
        try {
            axios.delete(`http://${import.meta.env.VITE_API_URI}/Users/block/${user?.login}`, {
                data: {
                    blocked: blocked?.login
                },
                withCredentials: true
            });
            toast.success(<span>{blocked.login} Unblocked Successfully</span>);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-around w-[20.833vw] mt-2 py-1 rounded-[0.5vw] hover:bg-slate-700 hover:scale-105 transition duration-100 ">
            <img
                className="w-[2.604vw] h-[2.604vw] rounded-full"
                src={blocked?.picture}
                alt="/"
            />
            <p className="text-[#DDDDDD] text-[1vw] md:text-[0.8vw] text-center font-['Poppins'] font-medium capitalize">
                {blocked?.login}
            </p>
            <div>
                <button
                    className="relative border border-slate-400 hover:border-slate-600 duration-500 group cursor-pointer overflow-hidden h-[1.875vw] w-[4.167vw] rounded-lg bg-slate-900 p-2 flex justify-center items-center font-extrabold"
                    onClick={unblock}
                >
                    <div className="absolute z-10 w-[9.375vw] h-[9.375vw] rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-slate-900 delay-150 group-hover:delay-75"></div>
                    <div className="absolute z-10 w-[5.729vw] h-[5.729vw] rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-slate-900 delay-150 group-hover:delay-100"></div>
                    <div className="absolute z-10 w-[3.333vw] h-[3.333vw] rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-slate-800 delay-150 group-hover:delay-150"></div>
                    <div className="absolute z-10 w-[2.083vw] h-[2.083vw] rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-slate-700 delay-150 group-hover:delay-200"></div>
                    <div className="absolute z-10 w-[1.042vw] h-[1.042vw] rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-slate-600 delay-150 group-hover:delay-300"></div>
                    <p className="z-10 text-[#ffffff] text-[1vw] md:text-[0.8vw] text-center font-['Poppins'] font-medium capitalize">
                        unblock
                    </p>
                </button>
            </div>
        </div>
    );
}

function BlockAccountComponent() {
    const { user } = userStore();
    const [relation, setRelation] = useState<userProps>();

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

    return (
        <div className="flex flex-col items-center w-[26.042vw] h-[15.5vw]">
            <div>
                <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">
                    blocked people
                </p>
            </div>
            <div className="w-[20.5vw] h-[0.104vw] mb-2 mt-4 bg-[#DDDDDD]"></div>
            <div className="h-[12vw]">
                <div className="h-[10.5vw] w-[23.438vw] flex flex-col items-center snap-y snap-mandatory overflow-scroll">
                    {!relation?.blockedUsers ? (
                        <p className="text-[#DDDDDD] pb-16 w-[10vw] text-[1.3vw] text-center font-['Poppins'] font-medium capitalize">
                            nothing
                        </p>
                    ) : (
                        (relation?.blockedUsers).map(
                            (blocked: userProps, index: number) => (
                                <BlockedPeople key={index} blocked={blocked} />
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default BlockAccountComponent;
