import { useEffect, useState } from 'react';
import { userStore } from '../../store';
import addusersvg from './assets/UserAdd.svg';
import chatsvg from './assets/chat.svg';
import blocksvg from './assets/block.svg';
import invitgamesvg from './assets/game.svg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { userProps } from '../../interfaces/userProps';
import { useNavigate } from 'react-router-dom';

// interface Relation {
//     friends: string[];
//     id: number;
// }

function AddFriendBlock({ username }: { username: string }) {
    const [relation, setRelation] = useState<any | null>([]);
    const { user, socketRef, setSelectedAllDms, selectedAllDMs } = userStore();
    const [userdata, setUserData] = useState<userProps>();

    useEffect(() => {
        const relationship = async () => {
            try {
                const res = await axios.get(
                    `http://${import.meta.env.VITE_API_URI}/Users/relations/${username}`,
                    {
                        withCredentials: true
                    }
                );
                setRelation(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        if (username) relationship();
    }, [username]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `http://${import.meta.env.VITE_API_URI}/Users/profile/${username}`,
                    {
                        withCredentials: true
                    }
                );
                const data = res.data;
                setUserData(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, [username]);

    const Block = async () => {
        if (user?.login === username) return;
        try {
            axios.post(`http://${import.meta.env.VITE_API_URI}/Users/block/${user?.login}`, {
                blocked: username
            },
            {
                withCredentials: true
            });
            if (socketRef) {
                socketRef.emit('deleteDm', {
                    targetId: userdata?.id
                });
                socketRef.off('findAllDms').on('findAllDms', (data: any) => {
                    setSelectedAllDms(data);
                });
            }
            toast.success(<span>{username} Blocked Successfully</span>);
        } catch (error) {
            console.log(error);
        }

        try {
            axios.delete(`http://${import.meta.env.VITE_API_URI}/Users/friends/${user?.login}`, {
                data: {
                    friend: username
                },
                withCredentials: true
            });
        } catch (error) {
            console.log(error);
        }
    };

    const AddFriend = async () => {
        if (user?.login === username) return;
        try {
            axios.post(`http://${import.meta.env.VITE_API_URI}/Users/friends/${user?.login}`, {
                friend: username
            },
            {
                withCredentials: true
            });
            toast.success(<span>{username} Added To Friends!</span>);
        } catch (error) {
            console.log(error);
        }
    };

    const CreateDms = () => {
        if (user?.id === userdata?.id) return;
        socketRef?.emit('createDm', {
            targetId: userdata?.id
        });
        socketRef?.off('findAllDms').on('findAllDms', (data: any) => {
            setSelectedAllDms(data);
        });
    };

    return (
        <div className="flex flex-col items-center justify-around w-[20.677vw] h-[21.5vw] rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <div className="pt-4">
                <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">
                    Action
                </p>
            </div>
            <div className="w-[15.5vw] h-[0.104vw] bg-[#DDDDDD]"></div>
            <div className="w-[15vw] h-[15vw] flex flex-col items-center justify-around">
                <div className="w-[15vw] h-[6vw] flex flex-col items-center justify-around rounded-[1vw] bg-[linear-gradient(91deg,_rgba(217,_217,_217,_0.18)_8.42%,_rgba(3,_19,_165,_0.33)_85.98%)] hover:bg-[#3d3d3d] transition-all">
                    <p className="text-[#d6d6d6] md:text-[1.2vw] text-[1vw] text-center font-[Poppins] font-semibold">
                        Add Friend
                    </p>
                    <button
                        className="focus:outline-none"
                        onClick={() => {
                            CreateDms(), AddFriend();
                        }}
                    >
                        <img
                            className="w-[1.5vw] hover:scale-125 transition-all"
                            src={addusersvg}
                            alt=""
                        />
                    </button>
                </div>
                <div className="w-[15vw] h-[6vw] flex flex-col items-center justify-around rounded-[1vw] bg-[linear-gradient(91deg,_rgba(217,_217,_217,_0.18)_8.71%,_rgba(178,_10,_10,_0.33)_86.12%)] hover:bg-[#3d3d3d] transition-all">
                    <p className="text-[#d6d6d6] md:text-[1.2vw] text-[1vw] text-center font-[Poppins] font-semibold">
                        Block
                    </p>
                    <button onClick={Block}>
                        <img
                            className="w-[1.7vw] hover:scale-125 transition-all"
                            src={blocksvg}
                            alt=""
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddFriendBlock;
