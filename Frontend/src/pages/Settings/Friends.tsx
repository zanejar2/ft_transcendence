import { useEffect, useState } from 'react';
import { UserType, userStore } from '../../store';
import { FriendsProps } from '../../interfaces/FriendsProps';
import axios from 'axios';
import { userProps } from '../../interfaces/userProps';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';

function FriendsComponent({ data }: { data: { login: userProps } }) {
    let text = 'offline';


    const backgroundcolor = () => {
        if (data.login.isOnline) {
            if (data.login.inGame) {
                text = 'in game';
                return 'linear-gradient(91deg, rgba(217, 217, 217, 0.18) 8.42%, rgba(3, 19, 165, 0.33) 85.98%)';
            } else {
                text = 'online';
                return 'linear-gradient(91deg, rgba(217, 217, 217, 0.18) 8.71%, rgba(47, 126, 45, 0.33) 84.74%)';
            }
        } else if (!data.login.isOnline) {
            return 'linear-gradient(91deg, rgba(217, 217, 217, 0.18) 8.71%, rgba(178, 10, 10, 0.33) 86.12%)';
        } else {
            return 'linear-gradient(91deg, rgba(217, 217, 217, 0.18) 8.71%, rgba(178, 10, 10, 0.33) 86.12%)';
        }
    };

    return (
        <Link to={`/profile/${data.login.login}`}>
            <div
                className="flex items-center justify-between w-[18.001vw] h-[3.125vw] mt-2 rounded-[2.292vw] hover:[box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]"
                style={{ background: backgroundcolor() }}
            >
                <img
                    className="w-[2.604vw] h-[2.604vw] ml-1 rounded-full"
                    src={data.login.picture}
                    alt="/"
                />
                <p className="text-[#DDDDDD] text-[1vw] md:text-[0.8vw] text-center font-['Poppins'] font-medium capitalize">
                    {data.login.login}
                </p>
                <p className="text-[#DDDDDD] w-[3.906vw] text-[1vw] md:text-[0.8vw] mr-2 text-center font-['Poppins'] font-medium capitalize">
                    {text}
                </p>
            </div>
        </Link>
    );
}

function Friends() {
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
        if (user?.login) relationship();
    }, [user?.login]);

    return (
        <div className="flex flex-col items-center justify-around w-[20.677vw] h-[21.5vw] rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <div className="pt-4">
                <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">
                    friends
                </p>
            </div>
            <div className="w-[15.5vw] h-[0.104vw] bg-[#DDDDDD]"></div>
            <div className="flex flex-col">
                <div className="flex flex-col items-center w-[18.001vw] h-[16vw] snap-y snap-mandatory overflow-scroll">
                    {!(relation?.friends && relation?.friends.length) ? (
                        <p className="text-[#DDDDDD] pt-16 w-[10vw] text-[1.3vw] text-center font-['Poppins'] font-medium capitalize">
                            No Friend Yet
                        </p>
                    ) : (
                        (relation?.friends).map(
                            (friend: userProps, index: number) => (
                                <FriendsComponent
                                    key={index}
                                    data={{ login: friend }}
                                />
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default Friends;
