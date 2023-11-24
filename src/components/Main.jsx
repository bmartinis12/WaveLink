import { onAuthStateChanged } from "firebase/auth";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCase } from "@/context/constants";
import axios from "axios";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import { useMediaQuery } from "@mui/material";
import SearchMessages from "./Chat/SearchMessages";

function Main() {
  const isNonMobileScreens = useMediaQuery('(min-width:640px)');
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  const [{ userInfo, currentChatUser, messageSearch }, dispatch] = useStateProvider();
  const socket = useRef();
  const router = useRouter();

  useEffect(() => {
    if (redirectLogin) router.push('/login');
  }, [redirectLogin]);


  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true);

    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, { email: currentUser.email });

      if (!data.status) router.push('/login');

      if (data?.data) {

        const { id, name, email, profilePicture: profileImage, status } = data.data;
        dispatch({
          type: reducerCase.SET_USER_INFO,
          userInfo: { id, name, email, profileImage, status }
        });
      }
    }
  });

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCase.SET_SOCKET, socket });
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve", (data) => {
        dispatch({
          type: reducerCase.ADD_MESSAGE, newMessage: {
            ...data.message
          }
        })
      });

      socket.current.on('online-users', ({ onlineUsers }) => {
        dispatch({ type: reducerCase.SET_ONLINE_USERS, onlineUsers });
      })
      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    const getMessages = async () => {
      const { data: { messages } } = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`);
      dispatch({ type: reducerCase.SET_MESSAGES, messages })
    }

    if (currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <main className="max-w-[1350px]">
      {isNonMobileScreens ? (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
          <ChatList />
          {currentChatUser ?
            !currentChatUser ? (
              <ChatList />
            ) : !messageSearch ? (
              <Chat />
            ) : (
              <SearchMessages />
            ) : (
              <Empty />
            )}
        </div>
      ) : (
        <div className="grid h-screen w-screen max-h-screen max-w-full overflow-hidden">
          {!currentChatUser ? (
            <ChatList />
          ) : !messageSearch ? (
            <Chat />
          ) : (
            <SearchMessages />
          )}
        </div>
      )}
    </main>
  );
}

export default Main;
