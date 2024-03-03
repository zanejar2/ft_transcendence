import { toast } from 'react-toastify';
import svgchat from './assets/svgchat.svg';
import { useEffect, useState } from 'react';
import { userStore } from '../../store';
import { useNavigate } from 'react-router-dom';

interface AddKickBanProps {
    editSetAddKickBan: () => void;
    role: string;
    member: any;
}

function SetAddKickBan({ editSetAddKickBan, role, member }: AddKickBanProps) {
    const {
        socketRef,
        selectedRoom,
        selectedRoomMembers,
        setSelectedRoomMumber,
        setSelectedAllRoom
    } = userStore();
    const navigate = useNavigate();


    const SetAdmin = () => {
        if (socketRef) {
            socketRef.emit('setAdmin', {
                channelId: selectedRoom,
                targetId: member.userId
            });
            selectedRoomMembers?.map((m: any) => {
                if (m.userId === member.userId) {
                    m.role = 'admin';
                }
            });
        }
        toast.success('Admin has been set');
    };

    const UnSetAdmin = () => {
        if (socketRef) {
            socketRef.emit('unsetAdmin', {
                channelId: selectedRoom,
                targetId: member.userId
            });
            selectedRoomMembers?.map((m: any) => {
                if (m.userId === member.userId) {
                    m.role = 'member';
                }
            });
        }
        toast.success('Admin has been unset');
    };

    const SetMute = () => {
        if (socketRef) {
            socketRef.emit('muteMember', {
                channelId: selectedRoom,
                targetId: member.userId
            });
        }
        toast.success('User has been muted');
    };

    const SetKick = () => {
        if (socketRef) {
            socketRef.emit('kickMember', {
                channelId: selectedRoom,
                targetId: member.userId
            });
            toast.success('User has been kicked');
        }
    };

    const SetBan = () => {
        if (socketRef) {
            socketRef.emit('banMember', {
                channelId: selectedRoom,
                targetId: member.userId
            });
        }
        toast.success('User has been banned');
    };

    useEffect(() => {
        socketRef?.on('getChannelMembers', (data: any) => {
            setSelectedRoomMumber(data);
        });

        socketRef?.on('findAllNonDmChannels', (data: any) => {
            setSelectedAllRoom(data);
        });

        return () => {
            socketRef?.off('getChannelMembers');
            socketRef?.off('findAllNonDmChannels');
        };
    }, [socketRef]);

    if (role === 'member') {
        return (
            <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflo h-full w-full"
                id="my-modal"
            >
                <div className="flex flex-col justify-center items-center relative top-20 mx-auto p-5 w-96 rounded-[0.521vw] bg-[linear-gradient(134deg,_rgba(9,_20,_31,_0.51)_-2.2%,_rgba(9,_20,_31,_0.50)_100.15%)]">
                    <div className="w-[20.469vw] h-[12vw] flex flex-col justify-evenly items-center">
                        <button
                            onClick={() => {
                                navigate('/profile/' + member.username);
                                editSetAddKickBan();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            VIEW PROFILE
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={editSetAddKickBan}
                            className="w-[10.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(255,68,68,0.8)] text-[#d4d3d3] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-red-800 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    } else if (role === 'admin') {
        return (
            <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflo h-full w-full"
                id="my-modal"
            >
                <div className="flex flex-col justify-center items-center relative top-20 mx-auto p-5 w-96 rounded-[0.521vw] bg-[linear-gradient(134deg,_rgba(9,_20,_31,_0.51)_-2.2%,_rgba(9,_20,_31,_0.50)_100.15%)]">
                    <div className="w-[20.469vw] h-[20vw] flex flex-col justify-evenly items-center">
                        <button
                            onClick={() => {
                                navigate('/profile/' + member.username);
                                editSetAddKickBan();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            VIEW PROFILE
                        </button>
                        <button
                            onClick={() => {
                                SetMute();
                                editSetAddKickBan();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            MUTE
                        </button>
                        <button
                            onClick={() => {
                                SetBan();
                                editSetAddKickBan();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            BAN
                        </button>
                        <button
                            onClick={() => {
                                SetKick();
                                editSetAddKickBan();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            KICK
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={editSetAddKickBan}
                            className="w-[10.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(255,68,68,0.8)] text-[#d4d3d3] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-red-800 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    } else if (role === 'owner') {
        return (
            <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflo h-full w-full"
                id="my-modal"
            >
                <div className="flex flex-col justify-center items-center relative top-20 mx-auto p-5 w-96 rounded-[0.521vw] bg-[linear-gradient(134deg,_rgba(9,_20,_31,_0.51)_-2.2%,_rgba(9,_20,_31,_0.50)_100.15%)]">
                    <div className="w-[20.469vw] h-[25vw] flex flex-col justify-evenly items-center">
                        <button
                            onClick={() => {
                                navigate('/profile/' + member.username);
                                editSetAddKickBan();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            VIEW PROFILE
                        </button>
                        {member.role === 'admin' ? (
                            <button
                                onClick={() => {
                                    UnSetAdmin();
                                    editSetAddKickBan();
                                }}
                                className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                            >
                                UNSET ADMIN
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    SetAdmin();
                                    editSetAddKickBan();
                                }}
                                className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                            >
                                SET ADMIN
                            </button>
                        )}
                        <button
                            onClick={() => {
                                SetMute();
                                editSetAddKickBan();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            MUTE
                        </button>
                        <button
                            onClick={() => {
                                SetBan();
                                editSetAddKickBan();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            BAN
                        </button>
                        <button
                            onClick={() => {
                                SetKick();
                                editSetAddKickBan();
                            }}
                            className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            KICK
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={editSetAddKickBan}
                            className="w-[10.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(255,68,68,0.8)] text-[#d4d3d3] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-red-800 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

function GroupMembers({ member }: { member: any }) {
    const [onMemberStatOpen, setonMemberStatOpen] = useState(false);
    const { selectedRoomMyRole } = userStore();

    const EnableSetAddKickBan = () => {
        setonMemberStatOpen(true);
    };

    const editSetAddKickBan = () => {
        setonMemberStatOpen(false);
    };

    return (
        <>
            <button
                className="flex items-center justify-start w-[16.448vw] h-[3.125vw] rounded-[0.4vw] hover:bg-slate-800"
                onClick={EnableSetAddKickBan}
            >
                <img
                    className="w-[2.604vw] h-[2.604vw] rounded-full ml-1"
                    src={member.user.picture}
                    alt="/"
                />
                <p className="text-[#DDDDDD] ml-3 md:text-[1vw] text-[1vw] text-center font-['Poppins'] font-medium capitalize">
                    {member.user.login}
                </p>
            </button>
            {onMemberStatOpen && (
                <SetAddKickBan
                    editSetAddKickBan={editSetAddKickBan}
                    role={selectedRoomMyRole!}
                    member={member}
                />
            )}
        </>
    );
}

export default GroupMembers;
