import { useStateProvider } from "@/context/StateContext";
import { reducerCase } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useEffect } from "react";
import ChatListItem from "./ChatLIstItem";

function List() {
  const [{ userInfo, userContacts, filteredContacts, contactSearch }, dispatch] = useStateProvider();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data: { users, onlineUsers } } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
        dispatch({ type: reducerCase.SET_ONLINE_USERS, onlineUsers });
        dispatch({ type: reducerCase.SET_USERS_CONTACTS, userContacts: users });
      } catch (error) {
        console.log(error);
      }
    }

    if (userInfo?.id) getContacts();
  }, [userInfo]);
  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0 ?
        (filteredContacts.map((contact) => (
          <ChatListItem data={contact} key={contact.messageId} />
        )))
        :
        (contactSearch ? (
          <div className="w-full sm:w-[312px] px-2 h-full flex items-center justify-center">
            <span className='text-secondary text-center'>Sorry, no accounts match that search</span>
          </div>
        ) : (userContacts.map((contact) => (
          <ChatListItem data={contact} key={contact.messageId} />
        ))))
      }
    </div>
  );
}

export default List;
