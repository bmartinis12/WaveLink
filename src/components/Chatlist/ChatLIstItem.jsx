import { useStateProvider } from "@/context/StateContext";
import Avatar from "../common/Avatar";
import { reducerCase } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatListItem({ data, isContactsPage = false }) {
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();

  const handleContactClick = () => {
    if (!isContactsPage) {
      dispatch({
        type: reducerCase.CHANGE_CURRENT_CHAT_USER,
        user: {
          name: data.name,
          about: data.about,
          profilePicture: data.profilePicture,
          email: data.email,
          id: userInfo.id === data.senderId ? data.recieverId : data.senderId,
        }
      })
    } else {
      dispatch({ type: reducerCase.CHANGE_CURRENT_CHAT_USER, user: { ...data } });
      dispatch({ type: reducerCase.SET_ALL_CONTACTS_PAGE })
    }
  }

  return (
    <div className={`flex cursor-pointer items-center hover:bg-background-default-hover`} onClick={handleContactClick}>
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type='lg' image={data?.profilePicture} />
      </div>
      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <span className="text-white">{data?.name}</span>
          </div>
          {!isContactsPage && (
            <div>
              <span className={`${!data.totalUnreadMessages > 0 ? "text-secondary" : "text-icon-green"} text-sm`}>
                {calculateTime(data.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex borde-b border-conversation-border pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactsPage ? data?.about || "\u00A0" : (
                <div className="flex items-center gap-1 max-w-[150px] sm:max-w-[200px]">
                  {data.senderId === userInfo.id && <MessageStatus messageStatus={data.messageStatus} />}
                  {data.type === 'text' && (
                    <span className="truncate">{data.message}</span>
                  )}
                  {data.type === 'audio' && (
                    <span className="flex gap-1 items-center">
                      <FaMicrophone className="text-panel-header-icon" />
                      Audio
                    </span>
                  )}
                  {data.type === 'image' && (
                    <span className="flex gap-1 items-center">
                      <FaCamera className="text-panel-header-icon" />
                      Image
                    </span>
                  )}
                </div>
              )}
            </span>
            {data.totalUnreadMessages > 0 && (
              <span className="bg-icon-green px-5 rounded-full text-sm">{data.totalUnreadMessages}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
