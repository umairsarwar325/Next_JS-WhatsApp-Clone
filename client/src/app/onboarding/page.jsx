"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";

const OnBoarding = () => {
  const { userInfo, newUser } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [defaultAvatar, setDefaultAvatar] = useState(
    userInfo?.profilePicture || "/default_avatar.png"
  );

  // if (!newUser) {
  //   router.push("/login");
  // }
  const { register, handleSubmit, setValue } = useForm();

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDefaultAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("profilePhoto", file); // Update the form's profilePhoto value
    }
  };

  const onSubmit = (data) => {
    const file = data.profilePhoto;
    if (file.name) {
      console.log("file has it")
    }
  };
  return (
    <div className="bg-panel-header-background min-h-screen w-full text-white flex flex-col items-center justify-center gap-5">
      <div className="flex items-center justify-center gap-2 text-white ">
        <Image width={200} height={200} src="/whatsapp.gif" alt="whatsapp" />
        <span className="text-6xl font-bold">WhatsApp</span>
      </div>
      <h2 className="text-2xl">Create new profile</h2>
      <div className="flex gap-6 items-center justify-between">
        <div className="flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)} id="create-profile-form">
            <Input
              label="Display Name"
              name="name"
              register={register}
              isRequired={true}
              defaultValue={userInfo?.name}
            />
            <Input
              label="About"
              name="about"
              register={register}
              defaultValue={userInfo?.email}
            />
            <Input
              name="profilePhoto"
              hidden
              id="photo-picker"
              type="file"
              register={register}
              onChange={(e) => {
                handleProfilePicChange(e);
              }}
            />
            <button type="submit">OK</button>
          </form>
        </div>
        <div>
          <Avatar type="xl" image={defaultAvatar} setImage={setDefaultAvatar} />
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
