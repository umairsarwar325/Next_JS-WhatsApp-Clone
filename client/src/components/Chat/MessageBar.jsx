import React, { useState } from "react";
import { ADD_MESSAGE } from "@/utils/ApiRoutes";
import axios from "axios";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useSelector } from "react-redux";

function MessageBar() {
  const { currentChatUser, userInfo } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sendMessageHandler = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(ADD_MESSAGE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message,
      });
      setMessage("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="w-full bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Smile Emoji"
          />
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attach File"
          />
        </div>
        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a meesage"
            className="bg-input-background text-sm focus:outline-none text-white w-full h-full px-5 py-4 rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="w-10 flex items-center justify-center">
          <button disabled={isLoading}>
            {
              isLoading ? (
                <p className="text-green-600">sending</p>
              ) : (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                  onClick={sendMessageHandler}
                />
              )
              /* <FaMicrophone
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Record"
              /> */
            }
          </button>
        </div>
      </>
    </div>
  );
}

export default MessageBar;
