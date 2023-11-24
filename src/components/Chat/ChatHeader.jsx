import Avatar from "../common/Avatar";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BiSearchAlt2 } from 'react-icons/bi';
import { useStateProvider } from "@/context/StateContext";
import { reducerCase } from "@/context/constants";

function ChatHeader() {

  const [{ currentChatUser, onlineUsers }, dispatch] = useStateProvider();


  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type='sm' image={currentChatUser?.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong text-sm sm:text-base">{currentChatUser?.name}</span>
          <span className="text-secondary text-sm">
            {onlineUsers.includes(currentChatUser.id) ? 'online' : 'offline'}
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" onClick={() => dispatch({ type: reducerCase.SET_MESSAGE_SEARCH })} />
        <IoMdArrowRoundBack name="exit chat" className="text-panel-header-icon cursor-pointer text-xl" onClick={() => dispatch({ type: reducerCase.SET_EXIT_CHAT })} />
      </div>
    </div>
  );
}

export default ChatHeader;
