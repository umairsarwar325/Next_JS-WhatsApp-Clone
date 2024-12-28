import React, { useEffect, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, setNewUser } from "@/store/slices/authSlice";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import Chat from "./Chat/Chat";

function Main() {
  const { userInfo } = useSelector((state) => state.auth);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

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
    }
  });
  return (
    <>
      <div className="grid grid-cols-main h-screen w-full max-h-screen max-w-full overflow-hidden">
        <ChatList />
        {/* <Empty /> */}
        <Chat />
      </div>
    </>
  );
}

export default Main;
