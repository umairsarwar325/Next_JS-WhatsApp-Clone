import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserInfo,
  setNewUser,
  setMessages,
  setSocket,
  addMessage,
} from "@/store/slices/globalSlice";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";

function Main() {
  const { userInfo, currentChatUser, messageSearch } = useSelector(
    (state) => state.auth
  );
  const [redirectLogin, setRedirectLogin] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const socket = useRef(null);
  useEffect(() => {
    if (redirectLogin) {
      router.push("/login");
    }
  }, [redirectLogin]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) {
      setRedirectLogin(true);
    }
    if (!userInfo && currentUser?.email) {
      try {
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email: currentUser?.email,
        });
        if (data.status && data.data) {
          const { id, email, name, about, profilePicture } = data.data;
          dispatch(setNewUser(false));
          dispatch(
            setUserInfo({
              id,
              email,
              name,
              about,
              profilePicture,
            })
          );
        } else {
          dispatch(setUserInfo(null));
          dispatch(setNewUser(false));
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
        console.log(error);
      }
    }
  });

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST); // "http://localhost:3005"
      socket.current.emit("add-user", userInfo.id); // emiting add-user event that is created in backend
      dispatch(setSocket(socket.current));
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-received", (data) => {
        console.log("recieved msg: ", data);
        // event "socket.on" runs when new message is recieved
        dispatch(addMessage({ ...data.message })); // adding new message to messages(global store state)
      });
      console.log("HAILLLL: socket event has been set");
    }
  }, [socket.current]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(
          `${GET_MESSAGES}/${userInfo?.id}/${currentChatUser?.id}`
        );
        dispatch(setMessages(data.messages));
      } catch (error) {
        console.log(error);
      }
    };
    if (currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser]);
  return (
    <>
      <div className="grid grid-cols-main h-screen w-full max-h-screen max-w-full overflow-hidden">
        <ChatList />
        {currentChatUser ? (
          <div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
            <Chat />
            {messageSearch && <SearchMessages />}
          </div>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}

export default Main;
