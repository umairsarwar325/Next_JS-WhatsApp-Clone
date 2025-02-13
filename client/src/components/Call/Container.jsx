import { endCall } from "@/store/slices/globalSlice";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

function Container({ data }) {
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);

  const { userInfo, socket } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.type === "outgoing") {
      socket.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const { data } = await axios.get(`${GET_CALL_TOKEN}/${userInfo?.id}`);
        if (data.token) {
          setToken(data.token);
        } else {
          throw new Error("No token found");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    getToken();
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      try {
        const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");
        const zg = new ZegoExpressEngine(
          parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
          process.env.NEXT_PUBLIC_ZEGO_SEVER_ID
        );
        setZgVar(zg);

        zg.on("roomStreamUpdate", async (roomID, updateType, streamList, extendedData) => {
          console.log("Room stream update:", { roomID, updateType, streamList, extendedData });

          if (updateType === "ADD" && streamList.length > 0) {
            const stream = streamList[0];
            if (stream.getTracks) {
              console.log("Remote stream tracks:", stream.getTracks());
              const rmVideo = document.getElementById("remote-video");
              const vd = document.createElement(data.callType === "video" ? "video" : "audio");
              vd.id = stream.streamID;
              vd.autoplay = true;
              vd.playsInline = true;
              vd.muted = false;
              if (rmVideo) {
                rmVideo.appendChild(vd);
              }
              zg.startPlayingStream(stream.streamID).then((stream) => {
                console.log("Playing stream tracks:", stream.getTracks());
                vd.srcObject = stream;
              });
            } else {
              console.error("getTracks method is not available on stream:", stream);
            }
          } else if (updateType === "DELETE" && zg && localStream && streamList[0]?.streamID) {
            zg.destroyStream(localStream);
            zg.stopPublishingStream(streamList[0].streamID);
            zg.logoutRoom(data.roomId.toString());
            dispatch(endCall());
          }
        });

        await zg.loginRoom(
          data.roomId.toString(),
          token,
          { userID: userInfo.id.toString(), userName: userInfo.name },
          { userUpdate: true }
        );

        const localStream = await zg.createStream({
          camera: { audio: true, video: data.callType === "video" },
        });
        console.log("Local stream tracks:", localStream.getTracks());
        setLocalStream(localStream);

        const localVideo = document.getElementById("local-video");
        const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
        videoElement.id = "video-local-zego";
        videoElement.className = "h-28 w-32";
        videoElement.autoplay = true;
        videoElement.muted = false;
        videoElement.playsInline = true;
        localVideo.appendChild(videoElement);

        const td = document.getElementById("video-local-zego");
        td.srcObject = localStream;
        const streamID = "123" + Date.now();
        setPublishStream(streamID);
        zg.startPublishingStream(streamID, localStream);
      } catch (error) {
        console.error("Error starting call:", error);
      }
    };

    if (token) {
      startCall();
    }
  }, [token]);

  const endCallHandler = () => {
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }
    if (data.callType === "video") {
      socket.emit("reject-video-call", { from: data.id });
    } else {
      socket.emit("reject-voice-call", { from: data.id });
    }
    dispatch(endCall());
  };

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col justify-center items-center h-[100vh] overflow-hidden text-white">
      <div className="flex flex-col gap-3 items-center ">
        <span className="text-5xl">{data.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video" ? "On going call" : "Calling"}
        </span>
      </div>
      {(!callAccepted || data.callType === "voice") && (
        <div className="my-14">
          <Image src={data.profilePicture} alt="avatar" width={300} height={300} className="rounded-full" />
        </div>
      )}
      <div id="remote-video" className="my-4 relative">
        <div className="absolute bottom-5 right-5" id="local-video"></div>
      </div>
      <div
        className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full cursor-pointer"
        onClick={endCallHandler}
      >
        <MdOutlineCallEnd className="text-3xl" title="End Call" />
      </div>
    </div>
  );
}

export default Container;
