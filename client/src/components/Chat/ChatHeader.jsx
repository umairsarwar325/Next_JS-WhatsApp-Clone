import React from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import {} from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

function ChatHeader() {
  return (
    <div className="w-full h-16 py-3 px-4 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type={"sm"} image="/profile" />
        <div className="flex flex-col">
          <span className="text-primary-strong">DEMO</span>
          <span className="text-secondary text-sm">
            online/offline
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <MdCall
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Call"
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Video"
        />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Search"
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Menu"
        />
      </div>
    </div>
  );
}

export default ChatHeader;
