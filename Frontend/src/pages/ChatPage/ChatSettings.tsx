import svgsetting from './assets/svgsettings.svg';
import svgsettings from './assets/settings.svg';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import EditGroup from './EditGroup';
import GroupMembers from './GroupMembers';
import { userStore } from '../../store';
import cross from './assets/cross.svg';
import axios from 'axios';
import { userProps } from '../../interfaces/userProps';
import { useNavigate } from 'react-router-dom';

function BlockInvitToGame() {
    const { socketRef, targetId, setSelectedAllDms } = userStore();

    const blockFromChat = () => {
        if (socketRef) {
            socketRef.emit('blockUser', {
                targetId: targetId
            });
            socketRef.emit('deleteDm', {
                targetId: targetId
            });
        }
    };

    useEffect(() => {
        socketRef?.on('getDms', (data: any) => {
            setSelectedAllDms(data);
        });

        return () => {
            socketRef?.off('blockUser');
            socketRef?.off('getDms');
        };
    }, [socketRef]);

    const inviteToGame = () => {
        if (socketRef) {
            socketRef.emit('sendInvite', {
                targetId: targetId
            });
        }
    };
    return (
        <div className="flex flex-col justify-between items-center w-[16.448vw] h-[7.5vw]">
            <button
                className="w-[12.5vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF] capitalize"
                onClick={inviteToGame}
            >
                invite to game
            </button>
            <button
                className="w-[12.5vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF] capitalize"
                onClick={blockFromChat}
            >
                block friend
            </button>
        </div>
    );
}

function EditGroupSettings({ role }: { role: string }) {
    const {
        socketRef,
        selectedRoom,
        setSelectedRoomMumber,
        setSelectedAllRoom,
        setSelectedRoomMessages
    } = userStore();
    const [isAddMemberOn, setisAddMemberOn] = useState(false);
    const [isEditGroupOn, setisEditGroupOn] = useState(false);
    const username = useRef<HTMLInputElement>(null);

    useEffect(() => {
        socketRef?.on('getChannelMembers', (data) => {
            setSelectedRoomMumber(data);
        });

        socketRef?.on('findAllNonDmChannels', (data) => {
            setSelectedAllRoom(data);
            setSelectedRoomMessages([]);
        });
        return () => {
            socketRef?.off('getChannelMembers');
            socketRef?.off('findAllNonDmChannels');
        };
    }, [socketRef]);

    const enableEditGroup = () => {
        setisEditGroupOn(true);
    };

    const disableEditGroup = () => {
        setisEditGroupOn(false);
    };

    const enableAddMember = () => {
        setisAddMemberOn(true);
    };

    const editAddMember = () => {
        setisAddMemberOn(false);
    };

    const addMember = () => {
        if (socketRef && username && username.current) {
            const userName = username.current.value;
            socketRef.emit('addMemberToPrivateChannel', {
                channelId: selectedRoom,
                targetName: userName
            });
        }
    };

    // useEffect(() => {
    //   socketRef?.on("getChannelMembers", (data) => {
    //     setSelectedRoomMumber(data);
    //   }
    //   );
    //   return () => {
    //     socketRef?.off("getChannelMembers");
    //   }
    // }, [socketRef]);

    const AddMemberToChannel = () => (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflo h-full w-full"
            id="my-modal"
        >
            <div className="relative top-20 mx-auto p-5 w-[30vw] h-[16vw] rounded-[0.521vw] bg-gray-800">
                <div className="mt-3 text-center">
                    <div className="flex justify-between">
                        <h3 className="text-[#bcd0dc] md:text-[1.546vw] text-[1.146vw] text-start pt-4 font-[Poppins] not-italic font-semibold leading-[normal]">
                            Add Member
                        </h3>
                        <button className="pb-4" onClick={editAddMember}>
                            <img src={cross} alt="/" />
                        </button>
                    </div>
                    <div className="mt-2 px-7 py-3">
                        <input
                            ref={username}
                            type="text"
                            placeholder="Add Members ..."
                            className="w-[20.904vw] h-[2.904vw] rounded-[0.356vw] bg-[rgba(206,223,234,0.95)] text-[#272727] md:text-[1vw] text-[1vw] text-start font-[Poppins] pl-3"
                        />
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={() => {
                                addMember(), editAddMember();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            ADD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const leaveRoom = () => {
        if (socketRef) {
            socketRef.emit('leaveChannel', {
                channelId: selectedRoom
            });
            // socketRef.off("getChannelMembers").on("getChannelMembers", (data: any) => {
            //   setSelectedRoomMumber(data);
            // });
            // socketRef.off("findAllNonDmChannels").on("findAllNonDmChannels", (data: any) => {
            //   setSelectedAllRoom(data);
            //   setSelectedRoomMessages([]);

            // });
        }
    };

    if (role === 'owner') {
        return (
            <div className="flex flex-col justify-between items-center w-[16.448vw] h-[10vw]">
                <button
                    className="w-[12.5vw] h-[3vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF] capitalize"
                    onClick={enableAddMember}
                >
                    add member
                </button>
                {isAddMemberOn && <AddMemberToChannel />}
                <button
                    className="w-[12.5vw] h-[3vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF] capitalize"
                    onClick={enableEditGroup}
                >
                    edit group
                </button>
                {isEditGroupOn && (
                    <EditGroup disableEditGroup={disableEditGroup} />
                )}
                <button
                    className="w-[12.5vw] h-[3vw] flex-shrink-0 rounded-[0.356vw] bg-red-700 text-[#d4d3d3] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-red-800 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                    onClick={leaveRoom}
                >
                    Leave the Room
                </button>
            </div>
        );
    } else if (role === 'admin') {
        return (
            <div className="flex flex-col justify-between items-center w-[16.448vw] h-[7.5vw]">
                <button
                    className="w-[12.5vw] h-[3vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF] capitalize"
                    onClick={enableAddMember}
                >
                    add member
                </button>
                {isAddMemberOn && <AddMemberToChannel />}
                <button
                    className="w-[12.5vw] h-[3vw] flex-shrink-0 rounded-[0.356vw] bg-red-700 text-[#d4d3d3] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-red-800 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                    onClick={leaveRoom}
                >
                    Leave the Room
                </button>
            </div>
        );
    } else if (role === 'member') {
        return (
            <div className="flex flex-col justify-center items-center w-[16.448vw] h-[7.5vw]">
                <button
                    className="w-[12.5vw] h-[3vw] flex-shrink-0 rounded-[0.356vw] bg-red-700 text-[#d4d3d3] md:text-[0.938vw] text-[0.938vw] text-center font-[Poppins] font-semibold hover:bg-red-800 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                    onClick={leaveRoom}
                >
                    Leave the Room
                </button>
            </div>
        );
    }
}

function ChatSettings({ select }: { select: boolean }) {
    const {
        selectedRoomMembers,
        selectedRoomMyRole,
        user,
        selectedRoom,
        selectedDMs
    } = userStore();

    return (
        <div className="w-[19.781vw] h-[38.542vw] flex flex-col justify-evenly items-center">
            <div className="h-[3.3vw] flex justify-evenly items-end">
                <img
                    className="w-[3.281vw] h-[3.229vw]"
                    src={svgsetting}
                    alt="/"
                />
                <img className="w-[8.146vw] " src={svgsettings} alt="/" />
            </div>
            <div className="w-[15.781vw] h-[0.104vw] bg-[#DDDDDD]" />
            <div className="w-[16.448vw] flex flex-col justify-between">
                {select ? (
                    selectedDMs === 0 ? (
                        <></>
                    ) : (
                        <BlockInvitToGame />
                    )
                ) : selectedRoom === 0 ? (
                    <></>
                ) : (
                    <EditGroupSettings role={selectedRoomMyRole!} />
                )}
            </div>
            <div className="w-[16.448vw] h-[20.188vw] rounded-[0.521vw] bg-[linear-gradient(134deg,_rgba(9,_20,_31,_0.51)_-2.2%,_rgba(9,_20,_31,_0.50)_100.15%)]">
                {!select && selectedRoom ? (
                    selectedRoomMembers?.map((member, i: number) => {
                        if (user?.id === member.userId) {
                            return null;
                        }
                        return <GroupMembers member={member} key={i} />;
                    })
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default ChatSettings;
