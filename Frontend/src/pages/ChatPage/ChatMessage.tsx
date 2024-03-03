import { useEffect, useRef } from "react";
import { userStore } from "../../store";
import svgchat from "./assets/group1.svg";
import send from "./assets/send.svg";
import React from "react";

function ChatMessage({ select }: { select: boolean }) {

  const {
    user,
    socketRef,
    selectedRoomMessages,
    selectedRoom,
    selectedRoomName,
    setSelectedRoomMessages,
    selectedDMs,
    selectedDmsAvatar,
  } = userStore();

  const contentRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [selectedRoomMessages]);

    const handleSubmit = (e: any) => {
      e.preventDefault();
      if (!contentRef.current.value) return;
      socketRef?.emit("createMessage", {
        content: contentRef.current.value,
        channelId: select ? selectedDMs : selectedRoom,
      });
      contentRef.current.value = "";
    };

  useEffect(() => {
    socketRef?.off("createMessage").on("createMessage", (data) => {
      setSelectedRoomMessages(data);
    });
  }, [socketRef]);


  if (!select) {
    return (
      <div className="w-[36.688vw] flex justify-center items-center rounded-[2.292vw] bg-[#2D4263B3] overflow-hidden">
        {
          selectedRoom ?
            (
              <div className="flex flex-col justify-between h-[38.5vw]">
                <div className="w-[36.688vw] h-[4.5vw] flex items-center pl-7 gap-5 bg-[rgba(157,_178,_191,_0.80)]">
                  <img className="w-[3vw]" src={svgchat} alt="/" />
                  <p className="text-[#272727] text-[1.4vw] font-bold capitalize">{selectedRoomName}</p>
                </div>
                <div className="h-[28.8vw] flex flex-col overflow-y-auto p-4 space-y-5 capitalize">
                  {
                    selectedRoomMessages?.slice().reverse().map((n, i) => (
                      <div key={i} className={`flex w-full ${n.sender.login === user?.login ? 'justify-end' : 'justify-start'}`}>
                        <div className={`border border-[rgba(157,178,191,0.5)] rounded-lg p-2 bg-[#cce1ef59] max-w-[27vw] break-words capitalize ${n.username === user?.login ? 'bg-[#f2faff59]' : 'bg-[#6e747859]'}`}>
                          <p className="text-[0.9vw] text-[#ffffff]">{n.sender.login} : </p>
                          <p className="text-[1.1vw] font-[poppins] font-semibold">{n.content}</p>
                        </div>
                      </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                 <form onSubmit={handleSubmit} className="flex items-center p-4">
                  <textarea
                    className="flex-grow h-[3vw] rounded-[2.292vw] resize-none bg-[rgba(157,178,191,0.35)] text-[#ffffff] font-[poppins] font-semibold text-[1vw] text-start align-middle"
                    ref={contentRef}
                    name="message"
                    placeholder="Enter your message here..."
                    style={{ padding: 'calc(1.7vw - 1em) 0 calc(1.7vw - 1em) 0', paddingLeft: '1vw' }}
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                  />
                  <button type="submit" className="ml-4">
                    <img className="w-[2.7vw] hover:scale-110 transition duration-100" src={send} alt="" />
                  </button>
                </form>
              </div>
            )
            :
            <p className="text-[2vw] text-[#DDDDDD] font-[poppins] font-semibold">SELECT ROOM...</p>
        }
      </div>
    );
  }

  else
    return (
      <div className="w-[36.688vw] flex justify-center items-center rounded-[2.292vw] bg-[#2D4263B3] overflow-hidden">
        {
          selectedDMs ?
            (
              <div className="flex flex-col justify-between h-[38.5vw]">
                <div className="w-[36.688vw] h-[4.5vw] flex items-center pl-7 gap-5 bg-[rgba(157,_178,_191,_0.80)]">
                  <img className="w-[3vw] rounded-full" src={selectedDmsAvatar!} alt="/" />
                  <p className="text-[#272727] text-[1.4vw] font-bold capitalize">{selectedRoomName}</p>
                </div>
                <div className="h-[28.8vw] flex flex-col overflow-y-auto p-4 space-y-5 capitalize">
                  {
                    selectedRoomMessages?.slice().reverse().map((n, i) => (
                      <div key={i} className={`flex w-full ${n.sender.login === selectedRoomName ? 'justify-start' : 'justify-end'}`}>
                        <div className={`border border-[rgba(157,178,191,0.5)] rounded-lg p-2 bg-[#cce1ef59] max-w-[27vw] break-words capitalize ${n.username === user?.login ? 'bg-[#f2faff59]' : 'bg-[#7075795a]'}`}>
                          <p className="text-[1.1vw] font-[poppins] font-semibold">{n.content}</p>
                        </div>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="flex items-center p-4">
                  <textarea
                    className="flex-grow h-[3vw] rounded-[2.292vw] resize-none bg-[rgba(157,178,191,0.35)] text-[#ffffff] font-[poppins] font-semibold text-[1vw] text-start align-middle"
                    ref={contentRef}
                    name="message"
                    placeholder="Enter your message here..."
                    style={{ padding: 'calc(1.7vw - 1em) 0 calc(1.7vw - 1em) 0', paddingLeft: '1vw' }}
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                  />
                  <button type="submit" className="ml-4">
                    <img className="w-[2.7vw] hover:scale-110 transition duration-100" src={send} alt="" />
                  </button>
                </form>
              </div>
            )
            :
            <p className="text-[2vw] text-[#DDDDDD] font-[poppins] font-semibold">SELECT ROOM...</p>
        }
      </div>
    );
}

export default ChatMessage;
