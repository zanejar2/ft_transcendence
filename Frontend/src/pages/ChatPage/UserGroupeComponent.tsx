import { useEffect, useRef, useState } from 'react';
import { userStore } from '../../store';
import svgchat from './assets/group1.svg';
import cross from './assets/cross.svg';

function UserGroupeComponent({ data }: any) {
    const {
        setSelectedRoom,
        setSelectedRoomName,
        setSelectedRoomMessages,
        socketRef
    } = userStore();
    const [isAddMemberOn, setisAddMemberOn] = useState(false);
    const password = useRef<HTMLInputElement>(null);

    const enableAddMember = () => {
        setisAddMemberOn(true);
    };

    const editAddMember = () => {
        setisAddMemberOn(false);
    };

    const joinRoom = () => {

        if (socketRef) {
            socketRef.emit('joinChannel', {
                channelId: data.id,
                password: password.current?.value
            });
        }
    };

    const joinRoomButton = () => {
        setSelectedRoom(data.id),
            setSelectedRoomName(data.name),
            socketRef?.emit('isJoinedToChannel', {
                channelId: data.id
            });
        socketRef?.off('isJoinedToChannel').on('isJoinedToChannel', () => {
            if (data.type === 'protected') enableAddMember();
        });
        joinRoom();
        setSelectedRoomMessages([]);
    };

    useEffect(() => {
        socketRef?.off('isJoinedToChannel').on('isJoinedToChannel', () => {
            if (data.type === 'protected') enableAddMember();
        });
    }, [socketRef]);

    const AddMemberToProtectedChannel = () => {
        return (
            <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflo h-full w-full"
                id="my-modal"
            >
                <div className="relative top-20 mx-auto p-5 w-[30vw] h-[16vw] rounded-[0.521vw] bg-gray-800">
                    <div className="mt-3 text-center">
                        <div className="flex justify-between">
                            <h3 className="text-[#bcd0dc] md:text-[1.546vw] text-[1.146vw] text-start font-[Poppins] not-italic font-semibold pt-2">
                                Enter password
                            </h3>
                            <button className="pb-2" onClick={editAddMember}>
                                <img src={cross} alt="/" />
                            </button>
                        </div>
                        <div className="mt-2 px-7 py-3">
                            <input
                                ref={password}
                                type="password"
                                placeholder="password ..."
                                className="w-[20.904vw] h-[2.904vw] rounded-[0.356vw] bg-[rgba(206,223,234,0.95)] text-[#272727] md:text-[1vw] text-[1vw] text-start font-[Poppins] pl-3"
                            />
                        </div>
                        <div className="items-center px-4 py-3">
                            <button
                                onClick={() => {
                                    joinRoom(), editAddMember();
                                }}
                                className="w-[15.469vw] h-[3.448vw] flex-shrink-0 rounded-[0.356vw] bg-[rgba(157,_178,_191,_0.80)] text-[#272727] md:text-[1.146vw] text-[1.146vw] text-center font-[Poppins] font-semibold hover:bg-slate-900 hover:scale-110 transition duration-100 hover:text-[#9DB2BF]"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <button
                onClick={joinRoomButton}
                className="flex items-center justify-start w-[16.448vw] h-[3.125vw] rounded-[0.4vw] hover:bg-slate-700 hover:scale-100 transition duration-100"
            >
                <img
                    className="w-[2.604vw] h-[2.604vw] rounded-full ml-1"
                    src={svgchat}
                    alt="/"
                />
                <div className="flex w-[13.2vw] justify-between items-center">
                    <p className="text-[#DDDDDD] ml-3 md:text-[0.938vw] text-[0.938vw] text-center font-['Poppins'] font-medium capitalize">
                        {data.name}
                    </p>
                    <p className="text-[#DDDDDD] ml-3 md:text-[0.7vw] text-[0.7vw] text-center font-['Poppins'] font-sm capitalize">
                        {data.type}
                    </p>
                </div>
            </button>
            {isAddMemberOn && <AddMemberToProtectedChannel />}
        </>
    );
}

export default UserGroupeComponent;
