import { useEffect } from 'react';
import { FriendsProps } from '../../interfaces/FriendsProps';
import { userProps } from '../../interfaces/userProps';




function Friends({ data }: { data: { login: FriendsProps } }) {

    useEffect(() => {
        // getStaus (data.login)
    }, [data.login])

    const backgroundcolor = () => {
        if (data.state === 'online') {
            return 'linear-gradient(91deg, rgba(217, 217, 217, 0.18) 8.71%, rgba(47, 126, 45, 0.33) 84.74%)';
        } else if (data.state === 'offline') {
            return 'linear-gradient(91deg, rgba(217, 217, 217, 0.18) 8.71%, rgba(178, 10, 10, 0.33) 86.12%)';
        } else if (data.state === 'in game') {
            return 'linear-gradient(91deg, rgba(217, 217, 217, 0.18) 8.42%, rgba(3, 19, 165, 0.33) 85.98%)';
        }
        else {
            return 'linear-gradient(91deg, rgba(217, 217, 217, 0.18) 8.71%, rgba(178, 10, 10, 0.33) 86.12%)';
        }
    };

    return (
        <div className="flex items-center justify-between w-[18.001vw] h-[3.125vw] mt-2 rounded-[2.292vw] hover:[box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]" style={{ background: backgroundcolor() }}>
            <img className="w-[2.604vw] h-[2.604vw] ml-1" src={data.login.avatar} alt="/" />
            <p className="text-[#DDDDDD] w-[3.906vw] md:text-[0.8vw] text-center font-['Poppins'] font-medium capitalize" >{data.login.login}</p>
            <p className="text-[#DDDDDD] w-[3.906vw] md:text-[0.8vw] mr-2 text-center font-['Poppins'] font-medium capitalize" >{data.state}</p>
        </div>
    )
}

function FriendsState({ data }: { data: { user: userProps } }) {
    return (
        <div className="flex flex-col items-center justify-around w-[20.677vw] h-[21.5vw] rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
            <div className="pt-4">
                <p className="text-[#DDDDDD] text-[1.5vw] text-center font-['Poppins'] font-medium capitalize">friends</p>
            </div>
            <div className="w-[15.5vw] h-[0.104vw] bg-[#DDDDDD]"></div>
            <div className="flex flex-col justify-around">
                <div className="flex flex-col items-center justify-around w-[18.001vw] snap-y snap-mandatory overflow-scroll">
                    {data.user.friends.length === 0 ? (
                        <p className="text-[#DDDDDD] pb-32 w-[10vw] text-[1.3vw] text-center font-['Poppins'] font-medium capitalize">No Friend Yet</p>
                    ) : (
                        data.user.friends.map((friend: FriendsProps, index: number) => (
                            <Friends key={index} data={{ login: friend }} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default FriendsState