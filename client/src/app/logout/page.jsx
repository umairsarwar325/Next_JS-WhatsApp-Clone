"use client";
import { setUserInfo } from "@/store/slices/globalSlice";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function logout() {
  const { userInfo, socket } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    socket.emit("signout", userInfo?.id);
    dispatch(setUserInfo(undefined));
    signOut(firebaseAuth);
    router.push("/login");
  }, [socket]);

  return <div className="bg-conversation-panel-background "></div>;
}

export default logout;
