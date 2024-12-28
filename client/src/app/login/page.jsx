"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, setNewUser } from "@/store/slices/authSlice";

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo, newUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!newUser && userInfo?.id) {
      router.push("/");
    }
  }, [newUser, userInfo, router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(firebaseAuth, provider);
    try {
      if (user) {
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email: user.email,
        });
        if (!data.status) {
          dispatch(setNewUser(true));
          dispatch(
            setUserInfo({
              email: user.email,
              name: user.displayName,
              profilePicture: user.photoURL,
              about: "",
            })
          );
          router.push("/onboarding");
        } else {
          const { id, email, name, profilePicture, about } = data?.data;
          dispatch(setNewUser(false));
          dispatch(
            setUserInfo({
              id,
              email,
              name,
              profilePicture,
              about,
            })
          );
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white ">
        <Image width={200} height={200} src="/whatsapp.gif" alt="whatsapp" />
        <span className="text-6xl font-bold">WhatsApp</span>
      </div>
      <button
        onClick={handleLogin}
        className="flex items-center justify-center gap-5 bg-search-input-container-background p-5 rounded-md"
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login with Google</span>
      </button>
    </div>
  );
}

export default Login;
