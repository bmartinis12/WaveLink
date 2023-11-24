import { useStateProvider } from "@/context/StateContext";
import ChatListHeader from "./ChatListHeader";
import List from "./List";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import ContactsList from "./ContactsList";

function ChatList() {
  const [{ contactsPage }] = useStateProvider();
  const [pageType, setPageType] = useState('default');

  useEffect(() => {
    if (contactsPage) setPageType('all-contacts');
    else setPageType('default');
  }, [contactsPage]);
  return (
    <div className="flex bg-panel-header-background flex-col max-h-screen z-20">
      {pageType === 'default' ? (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      ) : (
        <>
          <ContactsList />
        </>
      )}
    </div>
  );
}

export default ChatList;
