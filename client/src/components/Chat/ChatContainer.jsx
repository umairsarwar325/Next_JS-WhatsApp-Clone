import React from "react";
import { useSelector } from "react-redux";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
const VoiceMessage = dynamic(() => import("./VoiceMessage"), {
  ssr: false,
});

function ChatContainer() {
  const { userInfo, currentChatUser, messages } = useSelector(
    (state) => state.auth
  );
  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background w-full h-full bg-fixed opacity-5 fixed left-0 top-0 z-0" />
      <div className="flex w-full">
        <div className="mx-4 my-6 relative bottom-0 left-0 z-40 w-full h-full">
          <div className="flex flex-col justify-end w-full h-full gap-1 overflow-y-scroll">
            {messages?.map((message, index) => (
              <div
                key={message.id}
                className={` flex w-full ${
                  message.senderId == currentChatUser.id
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                {message.type === "text" && (
                  <div
                    className={`text-white px-2 py-1 text-sm rounded-md flex items-end gap-2 max-w-[45%] ${
                      message.senderId == currentChatUser.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-all">{message.message}</span>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-sm pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.senderId === userInfo?.id && (
                          <MessageStatus
                            messageStatus={message.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {message.type === "image" && <ImageMessage message={message} />}
                {message.type === "audio" && <VoiceMessage message={message} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
