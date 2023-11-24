import { useStateProvider } from "@/context/StateContext";
import Avatar from "../common/Avatar";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs';
import { reducerCase } from "@/context/constants";
import { BiLogOut } from "react-icons/bi";
import { useRouter } from "next/router";

function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider();
  const router = useRouter();

  const handleAllContactsPage = () => {
    dispatch({ type: reducerCase.SET_ALL_CONTACTS_PAGE });
  };

  const handleLogout = () => {
    router.push('/logout');
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type='sm' image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill className="text-panel-header-icon cursor-pointer text-xl" title="New Chat" onClick={handleAllContactsPage} />
        <>
          <BiLogOut className="text-panel-header-icon cursor-pointer text-xl" title="Logout" onClick={handleLogout} />
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;
