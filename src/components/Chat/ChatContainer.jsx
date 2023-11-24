import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();
  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-no-repeat bg-cover bg-fixed h-full w-full opacity-10 fixed left-0 top-0 z-0"></div>
      <div className="mx-5 sm:mx-10 py-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-3 sm:gap-1 overflow-auto">
            {messages.map((message, index) => (
              <div key={message.id} className={`flex ${message.senderId === currentChatUser.id ? 'justify-start' : 'justify-end'}`} >
                {message.type === 'text' && (
                  <div className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end z-40 max-w-[90%] sm:max-w-[75%] md:max-w-[50%] ${message.senderId === currentChatUser.id ? 'bg-incoming-background' : 'bg-outgoing-background'}`}>
                    <span>{message.message}</span>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[10px] pt-1 min-w-fit">{calculateTime(message.createdAt)}</span>
                      <span>
                        {message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />}
                      </span>
                    </div>
                  </div>
                )}
                {message.type === 'image' && (
                  <ImageMessage message={message} />
                )}
                {message.type === 'audio' && (
                  <VoiceMessage message={message} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}

export default ChatContainer;