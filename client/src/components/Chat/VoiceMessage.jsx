import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPause, FaPlay } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }) {
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const { currentChatUser, userInfo } = useSelector((state) => state.auth);

  const waveFormRef = useRef(null);
  const waveForm = useRef(null);

  useEffect(() => {
    if (waveForm.current === null) {
      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 3,
        height: 30,
        responsive: true,
      });
      waveForm.current.on("finish", () => {
        setIsPlaying(false);
      });
    }
    return () => {
      if (waveForm.current) {
        waveForm.current.destroy();
        waveForm.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (waveForm.current && message?.message) {
      const audioURL = `${HOST}/${message.message}`;
      const audio = new Audio(audioURL);
      setAudioMessage(audio);
      waveForm.current.load(audioURL);
      waveForm.current.on("ready", () => {
        setTotalDuration(waveForm.current.getDuration());
      });
    }
  }, [message?.message]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayAudio = () => {
    if (audioMessage && waveForm.current) {
      waveForm.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    if (waveForm.current) {
      waveForm.current.pause();
    }
    if (audioMessage) {
      audioMessage.pause();
    }
    setIsPlaying(false);
  };

  return (
    <div
      className={`flex items-center gap-3 text-white px-2 pr-2 py-4 text-sm rounded-md ${
        message?.senderId === currentChatUser?.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <Avatar
        type="sm"
        image={
          message?.senderId === currentChatUser?.id
            ? currentChatUser?.profilePicture
            : userInfo?.profilePicture
        }
      />
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaPause onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef} />
        <div className="text-bubble-meta text-sm pt-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === userInfo.id && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
