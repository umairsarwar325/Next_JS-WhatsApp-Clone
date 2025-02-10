import React, { useEffect, useRef, useState } from "react";
import { ADD_IMAGE_MESSAGE, ADD_MESSAGE } from "@/utils/ApiRoutes";
import axios from "axios";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "@/store/slices/globalSlice";
import EmojiPicker from "emoji-picker-react";
import dynamic from "next/dynamic";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false,
});

function MessageBar() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef();
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const { currentChatUser, userInfo, socket } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [grabphoto, setGrabphoto] = useState(false);

  useEffect(() => {
    if (grabphoto) {
      const data = document.getElementById("photo-graber");
      data.click(); // click the input
      document.body.onfocus = (e) => {
        setGrabphoto(false);
      };
    }
  }, [grabphoto]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handlePicChange = async (e) => {
    try {
      setIsLoading(true);
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await axios.post(ADD_IMAGE_MESSAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            to: currentChatUser?.id,
            from: userInfo?.id,
          },
        });
        if (data.status) {
          socket.emit("send-msg", {
            to: currentChatUser?.id,
            from: userInfo?.id,
            message: data?.message,
          }); // emiting send-msg event, we must add this event in server/index.js
          dispatch(addMessage({ ...data.message, fromSelf: true }));
        } else {
          throw new Error("Error sending message");
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const sendMessageHandler = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(ADD_MESSAGE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message,
      });
      if (data.status) {
        socket.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: data?.message,
        }); // emiting send-msg event, we must add this event in server/index.js
        dispatch(addMessage({ ...data.message, fromSelf: true }));
        setMessage("");
      } else {
        throw new Error("Error sending message");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (emoji) => {
    setMessage((prev) => (prev += emoji.emoji));
  };

  return (
    <div className="w-full bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Smile Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                className="absolute bottom-24 left-16 z-40"
                ref={emojiPickerRef}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach File"
              id="attachment"
              onClick={() => {
                setGrabphoto(true);
              }}
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
            <input
              name="profilePhoto"
              hidden
              id="photo-graber"
              type="file"
              accept="image/*"
              onChange={(e) => {
                handlePicChange(e);
              }}
            />
          </div>
          <div className="w-10 flex items-center justify-center">
            <button disabled={isLoading}>
              {isLoading ? (
                <BiLoaderCircle className="text-panel-header-icon cursor-pointer text-2xl animate-spin" />
              ) : message.length ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                  onClick={sendMessageHandler}
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record"
                  onClick={() => setShowAudioRecorder(true)}
                />
              )}
            </button>
          </div>
        </>
      )}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
