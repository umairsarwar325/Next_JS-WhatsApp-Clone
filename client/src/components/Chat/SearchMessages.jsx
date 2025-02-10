import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setMessageSearch } from "@/store/slices/globalSlice";
import { BiSearchAlt2 } from "react-icons/bi";
import { calculateTime } from "@/utils/CalculateTime";

function SearchMessages() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages] = useState([]);
  const { currentChatUser, messages } = useSelector((state) => state.auth);

  useEffect(() => {
    if (searchTerm) {
      setSearchedMessages(
        messages?.filter(
          (message) =>
            message.type === "text" && message.message.includes(searchTerm)
        )
      );
    } else {
      setSearchedMessages([]);
    }
  }, [searchTerm]);

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
      <div className="h-16 px-4 py-5 flex items-center gap-10 bg-panel-header-background text-primary-strong">
        <IoClose
          onClick={() => {
            dispatch(setMessageSearch());
          }}
          className="cursor-pointer text-icon-lighter text-2xl"
        />
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto h-full">
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center px-5 gap-3 h-14 w-full">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2
                  className="text-panel-header-icon cursor-pointer text-lg"
                  title="Search"
                />
              </div>
              <div className="w-full">
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  type="text"
                  placeholder="Search messages"
                  className="bg-transparent text-sm focus:outline-none text-white w-full"
                />
              </div>
            </div>
          </div>
          <span className="mt-6 text-secondary">
            {!searchTerm.length &&
              `Search for messages with ${currentChatUser?.name}`}
          </span>
        </div>
        <div className="flex flex-col justify-center h-full">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No messages found
            </span>
          )}
          <div className="flex flex-col w-full h-full">
            {searchedMessages?.map((message) => (
              <div className="flex flex-col justify-center hover:bg-background-default-hover cursor-pointer w-full px-5 border-b-[0.1px] border-secondary py-5">
                <div className="text-sm text-secondary">
                  {calculateTime(message.createdAt)}
                </div>
                <div className="text-icon-green">{message.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMessages;
