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
  setIncomingVoiceCall,
  setIncomingVideoCall,
  endCall,
  setOnlineUsers,
} from "@/store/slices/globalSlice";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";

function Main() {
  const {
    userInfo,
    currentChatUser,
    messageSearch,
    videoCall,
    voiceCall,
    incomingVideoCall,
    incomingVoiceCall,
  } = useSelector((state) => state.auth);
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
      socket.current.on("online-users", (data) => {
        dispatch(setOnlineUsers(data.onlineUsers));
      });
      socket.current.on("msg-received", (data) => {
        // event "socket.on" runs when new message is recieved
        dispatch(addMessage({ ...data.message })); // adding new message to messages(global store state)
      });
      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch(
          setIncomingVoiceCall({
            ...from,
            roomId,
            callType,
          })
        );
      });
      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch(
          setIncomingVideoCall({
            ...from,
            roomId,
            callType,
          })
        );
      });
      socket.current.on("voice-call-rejected", () => {
        dispatch(endCall());
      });
      socket.current.on("video-call-rejected", () => {
        dispatch(endCall());
      });
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
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden absolute top-0 left-0 z-50">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden absolute top-0 left-0 z-50">
          <VoiceCall />
        </div>
      )}
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
