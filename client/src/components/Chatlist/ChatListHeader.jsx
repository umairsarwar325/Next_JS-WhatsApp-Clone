import React from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { setAllContactsPage } from "@/store/slices/globalSlice";
import { useRouter } from "next/navigation";

function ChatListHeader() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAllContactsPage = () => {
    dispatch(setAllContactsPage());
  };

  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoodinates, setContextMenuCoodinates] = useState({
    x: 0,
    y: 0,
  });

  const contextMenuOptions = [
    {
      name: "Logout",
      callback: () => {
        setIsContextMenuVisible(false);
        router.push("/logout");
      },
    },
  ];
  const showConextMenu = (e) => {
    setContextMenuCoodinates({ x: e.pageX, y: e.pageY });
    setIsContextMenuVisible(true);
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar
          type="sm"
          image={userInfo?.profilePicture || "/default_avatar.png"}
        />
      </div>
      <div className="flex items-center gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Menu"
          id="context-opener"
          onClick={(e) => {
            showConextMenu(e);
          }}
        />
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextMenuCoodinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
    </div>
  );
}

export default ChatListHeader;
