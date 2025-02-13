"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, setNewUser } from "@/store/slices/globalSlice";
import { IoLogoWhatsapp } from "react-icons/io";
import { BiLoaderCircle } from "react-icons/bi";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.id) {
      router.push("/");
    }
  }, [userInfo, router]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(firebaseAuth, provider);
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
          setIsLoading(false);
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
          setIsLoading(false);
          router.push("/");
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-3 text-white ">
        <IoLogoWhatsapp className="text-9xl" />
        <span className="text-6xl font-bold">WhatsApp</span>
      </div>
      <button
        onClick={handleLogin}
        className="flex items-center justify-center gap-5 bg-search-input-container-background p-5 rounded-md"
        disabled={isLoading}
      >
        {isLoading ? (
          <BiLoaderCircle className="text-icon-green text-4xl animate-spin" />
        ) : (
          <FcGoogle className="text-4xl" />
        )}
        <span className="text-white text-2xl">Login with Google</span>
      </button>
    </div>
  );
}

export default Login;
