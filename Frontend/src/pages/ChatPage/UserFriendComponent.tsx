import { userStore } from "../../store";
function UserFriendComponent({ data }: any) {
  const { user, selectedRoomName, selectedDmsAvatar, setSelectedDMs, setSelectedDMsName, setSelectedRoomMessages, setSelectedDmsAvatar, setTargetId } = userStore()

  const dmnName = data.channelMembers[0].user.login === user?.login ? data.channelMembers[1].user.login : data.channelMembers[0].user.login;
  const dmnAvatar = data.channelMembers[0].user.login === user?.login ? data.channelMembers[1].user.picture : data.channelMembers[0].user.picture;
  const targetId = data.channelMembers[0].user.login === user?.login ? data.channelMembers[1].user.id : data.channelMembers[0].user.id;
  
  return (
    <button
      onClick={() => {
        setSelectedDMs(data.id),
          setSelectedDMsName(dmnName);
          setSelectedDmsAvatar(dmnAvatar);
          setTargetId(targetId);
        setSelectedRoomMessages([]);
      }}
      className="flex items-center justify-start w-[16.448vw] h-[3.125vw] rounded-[0.4vw] hover:bg-slate-700 hover:scale-100 transition duration-100">
      <img className="w-[2.604vw] h-[2.604vw] rounded-full ml-1" src={dmnAvatar} alt="/" />
      <p className="text-[#DDDDDD] ml-3 md:text-[0.938vw] text-[0.938vw] text-center font-['Poppins'] font-medium capitalize">{dmnName}</p>
    </button>
  );
}
export default UserFriendComponent