import { useState, useEffect } from 'react';
import onlineChat from './assets/onlineChat.svg';
import svgchat from './assets/svgchat.svg';
import svgcreatgroup from './assets/addgroup.svg';
import { toast } from 'react-toastify';
import UserFriendComponent from './UserFriendComponent';
import UserGroupeComponent from './UserGroupeComponent';
import ChatSettings from './ChatSettings';
import ChatMessage from './ChatMessage';
import Creategroup from './Creategroup';
import { userStore } from '../../store';

export function MainChat() {
    const [select, setSelect] = useState(false);
    const [groupstat, setGroupstat] = useState(false);
    const {
        socketRef,
        isconnected,
        selectedAllRoom,
        setSelectedAllRoom,
        selectedAllDMs,
        setSelectedAllDms,
        setSelectedDMs,
        setSelectedRoom
    } = userStore();

    useEffect(() => {
        if (isconnected) {
            socketRef?.emit('getChannels');

            socketRef?.on('getChannels', (data: any) => {
                setSelectedAllRoom(data);
            });

            socketRef?.on('findAllNonDmChannels', (data: any) => {
                setSelectedAllRoom(data);
            });
        }

        return () => {
            socketRef?.off('getChannels');
            socketRef?.off('findAllNonDmChannels');
        };
    }, [socketRef, isconnected]);

    useEffect(() => {
        if (isconnected) {
            socketRef?.emit('getDms');
            socketRef?.on('getDms', (data: any) => {
                setSelectedAllDms(data);
            });
        }
        return () => {
            socketRef?.off('getDms');
        };
    }, [socketRef, isconnected]);

    const FriendComponent = () => {
        setSelect(true);
        setSelectedDMs(0);
    };

    const GroupComponent = () => {
        setSelect(false);
        setSelectedRoom(0);
    };

    const enablecreategroup = () => {
        setGroupstat(true);
    };

    const disablecreategroup = () => {
        setGroupstat(false);
    };

    if (!isconnected)
        return (
            <>
                <div className="h-full w-full">loading</div>
            </>
        );

    return (
        <div className="w-[89vw] h-[38.542vw] flex items-center justify-center">
            <div className="w-[76.198vw] h-[38.542vw] flex rounded-[2.292vw] bg-[rgba(157,_178,_191,_0.35)] [box-shadow:0px_-1px_26px_-2px_rgba(82,_109,_130,_0.80)]">
                <div className="w-[19.781vw] h-[38.542vw] flex flex-col justify-evenly items-center">
                    <div className="h-[3.3vw] flex justify-evenly items-end">
                        <img
                            className="w-[3.281vw] h-[3.229vw]"
                            src={svgchat}
                            alt="/"
                        />
                        <img
                            className="w-[11.146vw] "
                            src={onlineChat}
                            alt="/"
                        />
                    </div>
                    <div className="w-[15.781vw] h-[0.104vw] bg-[#DDDDDD]" />
                    <div className="w-[16.448vw] h-[5vw] flex flex-col justify-between">
                        <div className="flex pl-2 gap-[6.5vw]">
                            <p className="text-[1.146vw] text-[#DDDDDD] font-bold capitalize">
                                create Group
                            </p>
                            <button onClick={enablecreategroup}>
                                <img
                                    className="w-[1.745vw] h-[0.938vw] hover:scale-110 transition-all"
                                    src={svgcreatgroup}
                                    alt="/"
                                />
                            </button>
                            {groupstat && (
                                <Creategroup
                                    disablecreategroup={disablecreategroup}
                                />
                            )}
                        </div>
                        <div className="w-[16.448vw] h-[2.6] flex justify-around">
                            <button
                                className="w-[7.5vw] h-[2.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                                onClick={FriendComponent}
                            >
                                Friends
                            </button>
                            <button
                                className="w-[7.5vw] h-[2.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                                onClick={GroupComponent}
                            >
                                Groups
                            </button>
                        </div>
                    </div>
                    <div className="w-[16.448vw] h-[20.188vw] snap-y snap-mandatory overflow-scroll">
                        {select
                            ? selectedAllDMs?.map((DMs: any) => (
                                  <UserFriendComponent
                                      key={DMs.id}
                                      data={DMs}
                                  />
                              ))
                            : selectedAllRoom?.map((channel: any) => (
                                  <UserGroupeComponent
                                      key={channel.id}
                                      data={channel}
                                  />
                              ))}
                    </div>
                </div>
                <ChatMessage select={select} />
                <ChatSettings select={select} />
            </div>
        </div>
    );
}
