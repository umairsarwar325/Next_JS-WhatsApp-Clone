import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import {} from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  setExitChat,
  setMessageSearch,
  setVideoCall,
  setVoiceCall,
} from "@/store/slices/globalSlice";
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const { currentChatUser, onlineUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoodinates, setContextMenuCoodinates] = useState({
    x: 0,
    y: 0,
  });

  const contextMenuOptions = [
    {
      name: "Exit Chat",
      callback: () => {
        dispatch(setExitChat());
      },
    },
  ];
  const showConextMenu = (e) => {
    setContextMenuCoodinates({ x: e.pageX - 50, y: e.pageY + 20 });
    setIsContextMenuVisible(true);
  };
  const handleVoiceCall = () => {
    dispatch(
      setVoiceCall({
        ...currentChatUser,
        type: "outgoing",
        callType: "voice",
        roomId: Date.now(),
      })
    );
  };
  const handleVideoCall = () => {
    dispatch(
      setVideoCall({
        ...currentChatUser,
        type: "outgoing",
        callType: "video",
        roomId: Date.now(),
      })
    );
  };

  return (
    <div className="w-full h-16 py-3 px-4 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type={"sm"} image={currentChatUser?.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.name}</span>
          <span className="text-secondary text-sm">
            {onlineUsers?.includes(currentChatUser?.id) ? "online" : "offline"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <MdCall
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Voice Call"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Video Call"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Search"
          onClick={() => {
            dispatch(setMessageSearch());
          }}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Menu"
          id="context-opener"
          onClick={(e) => {
            showConextMenu(e);
          }}
        />
        {isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            coordinates={contextMenuCoodinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
