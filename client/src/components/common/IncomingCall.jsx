import React from "react";
import {
  endCall,
  setVoiceCall,
  setIncomingVoiceCall,
} from "@/store/slices/globalSlice";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

function IncomingCall() {
  const { incomingVoiceCall, socket } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const acceptCall = async () => {
    dispatch(
      setVoiceCall({
        ...incomingVoiceCall,
        type: "incoming",
      })
    );
    socket.emit("accept-incoming-call", { id: incomingVoiceCall.id });
    dispatch(setIncomingVoiceCall(undefined));
  };
  const rejectCall = async () => {
    socket.emit("reject-voice-call", { from: incomingVoiceCall.id });
    dispatch(endCall());
  };

  return (
    <div className="h-24 w-96 fixed bottom-8 right-6 mb-0 z-50 rounded-sm flex items-center justify-around gap-2 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14 px-3">
      <div>
        <Image
          src={incomingVoiceCall?.profilePicture}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="text-sm font-semibold">{incomingVoiceCall?.name}</div>
        <div className="text-xs">Incoming Voice Call</div>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="bg-red-500 py-1 px-3 text-sm rounded-full"
          onClick={rejectCall}
        >
          Reject
        </button>
        <button
          className="bg-green-500 py-1 px-3 text-sm rounded-full"
          onClick={acceptCall}
        >
          Accept
        </button>
      </div>
    </div>
  );
}

export default IncomingCall;
