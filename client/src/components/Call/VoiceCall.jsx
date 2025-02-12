import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
const Container = dynamic(() => import("./Container"), {
  ssr: false,
});
function VoiceCall() {
  const { userInfo, voiceCall, socket } = useSelector((state) => state.auth);

  useEffect(() => {
    if (voiceCall?.type === "outgoing") {
      socket.emit("outgoing-voice-call", {
        to: voiceCall.id,
        from: {
          id: userInfo.id,
          profilePicture: userInfo.profilePicture,
          name: userInfo.name,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }
  }, [voiceCall]);

  return <Container data={voiceCall} />;
}

export default VoiceCall;
