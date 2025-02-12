import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
const Container = dynamic(() => import("./Container"), {
  ssr: false,
});
function VideoCall() {
  const { userInfo, videoCall, socket } = useSelector((state) => state.auth);

  useEffect(() => {
    if (videoCall?.type === "outgoing") {
      socket.emit("outgoing-video-call", {
        to: videoCall.id,
        from: {
          id: userInfo.id,
          profilePicture: userInfo.profilePicture,
          name: userInfo.name,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, [videoCall]);
  return <Container data={videoCall} />;
}

export default VideoCall;
