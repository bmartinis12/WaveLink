import { useStateProvider } from "@/context/StateContext";
import { reducerCase } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatListItem from "./ChatLIstItem";

function ContactsList() {
  const [{ }, dispatch] = useStateProvider();
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchContacts, setSearchContacts] = useState([]);

  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};
      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((obj) => obj.name.toLowerCase().includes(searchTerm.toLowerCase()));
      });
      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts)
    }
  }, [searchTerm]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data: { users } } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
        setSearchContacts(users);
      } catch (error) {
        console.log(error);
      }
    }
    getContacts();
  }, [])
  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack className="cursor-pointer text-xl" onClick={() => dispatch({ type: reducerCase.SET_ALL_CONTACTS_PAGE })} />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="flex items-center gap-5 bg-panel-header-background px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div className="w-full">
              <input type="text" placeholder='Search contacts...' className='text-sm bg-transparent focus:outline-none text-white w-full' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
        {
          Object.entries(searchContacts).map(([initialLetter, userList]) => {
            return (
              <div key={Date.now() + initialLetter}>
                {
                  userList.length ? (
                    <div>
                      <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
                      {userList.map((contact) => (
                        <ChatListItem data={contact} isContactsPage={true} key={contact.id} />
                      ))}
                    </div>
                  ) : null
                }
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default ContactsList;
