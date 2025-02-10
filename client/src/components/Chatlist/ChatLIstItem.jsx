import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentChatUser,
  setAllContactsPage,
} from "@/store/slices/globalSlice";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({ data, isContactPage = false }) {
  const { currentChatUser, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleContactClick = () => {
    // if (currentChatUser?.id === data?.id) {
    if (!isContactPage) {
      dispatch(
        setCurrentChatUser({
          ...data,
          id: userInfo.id === data.senderId ? data.receiverId : data.senderId,
        })
      );
    } else {
      dispatch(setCurrentChatUser(data));
      dispatch(setAllContactsPage());
    }
    // }
  };
  return (
    <div
      onClick={handleContactClick}
      className={`flex items-center cursor-pointer hover:bg-background-default-hover p-2 w-full min-h-16 rounded-xl transition-all duration-200`}
    >
      <div className="min-w-fit px-3 flex items-center h-full">
        <Avatar type={"sm"} image={data?.profilePicture} />
      </div>
      <div className="flex flex-col min-h-full border-b border-conversation-border w-full py-1">
        <div className="flex justify-between w-full">
          <span className="text-white">{data?.name}</span>
          <div className="flex items-center gap-1">
            {!isContactPage && (
              <span
                className={`text-sm ${
                  data.totalUnreadMessages > 0
                    ? "text-icon-green"
                    : "text-secondary"
                }`}
              >
                {calculateTime(data.createdAt)}
              </span>
            )}
            {!isContactPage && data.totalUnreadMessages > 0 && (
              <span className="bg-icon-green text-sm text-white px-2 rounded-full flex items-center justify-center">
                {data.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary line-clamp-1 text-sm">
            {isContactPage ? (
              data?.about || "\u00A0"
            ) : (
              <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                <div className="flex items-center gap-1">
                  {data?.senderId === userInfo?.id && (
                    <MessageStatus messageStatus={data.messageStatus} />
                  )}
                  {data.type === "text" && (
                    <span className="text-secondary truncate">
                      {data.message}
                    </span>
                  )}
                  {data.type === "image" && (
                    <span className="flex gap-1 items-center text-secondary">
                      <FaCamera className="text-panel-header-icon" />
                      Image
                    </span>
                  )}
                  {data.type === "audio" && (
                    <span className="flex gap-1 items-center text-secondary">
                      <FaMicrophone className="text-panel-header-icon" />
                      Voice
                    </span>
                  )}
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
