import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "@/store/slices/globalSlice";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import { BiLoaderCircle } from "react-icons/bi";
import axios from "axios";
import { ADD_AUDIO_MESSAGE } from "@/utils/ApiRoutes";

function CaptureAudio({ hide }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  // const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);
  const waveForm = useRef();

  const { currentChatUser, userInfo, socket } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!waveFormRef.current) {
      console.error("waveFormRef is not bound to a DOM element");
      return;
    }
    waveForm.current = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#cc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    waveForm.current.on("finish", () => {
      setIsPlaying(false);
    });
    return () => {
      if (waveForm.current) {
        waveForm.current.destroy();
        waveForm.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (waveForm.current) {
      handleStartRecording();
    }
  }, [waveForm.current]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);
          waveForm.current.load(audioURL);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.log("Error accessing microphone: ", error);
      });
  };
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.current.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    }
  };

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveForm.current.stop();
      waveForm.current.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };
  const handlePauseRecording = () => {
    waveForm.current.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const handleSendAudio = async () => {
    console.log("sendig audio");
    try {
      setIsLoading(true);
      if (renderedAudio) {
        const formData = new FormData();
        formData.append("audio", renderedAudio);
        const { data } = await axios.post(ADD_AUDIO_MESSAGE, formData, {
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
          });
          dispatch(addMessage({ ...data.message, fromSelf: true }));
          hide()
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

  return (
    <div className="flex text-2xl w-full justify-center items-center gap-5">
      <div>
        <FaTrash
          title="Delete Audio"
          className="text-panel-header-icon cursor-pointer"
          onClick={() => hide()}
        />
      </div>
      <div className="py-2 px-4 text-white text-lg flex justify-between items-center gap-3 bg-search-input-container-background rounded-full drop-shadow-lg w-full h-12">
        {isRecording ? (
          <div className="text-red-500 animate-pulse text-center">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center gap-3">
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay
                    className="text-panel-header-icon cursor-pointer"
                    onClick={handlePlayRecording}
                  />
                ) : (
                  <FaStop
                    className="text-panel-header-icon cursor-pointer"
                    onClick={handlePauseRecording}
                  />
                )}
              </>
            )}
            <div className="w-full h-full" ref={waveFormRef} />
            {recordedAudio && isPlaying && (
              <span>{formatTime(currentPlaybackTime)}</span>
            )}
            {recordedAudio && !isPlaying && (
              <span>{formatTime(totalDuration)}</span>
            )}
          </div>
        )}
        <div>
          {!isRecording ? (
            <FaMicrophone
              onClick={handleStartRecording}
              className="text-red-500 cursor-pointer"
              title="Start Recording"
            />
          ) : (
            <FaPauseCircle
              onClick={handleStopRecording}
              className="text-red-500 cursor-pointer"
              title="Stop Recording"
            />
          )}
        </div>
      </div>
      <div className="w-10 flex items-center justify-end pr-1">
        {isRecording ? (
          <BsThreeDots className="text-panel-header-icon cursor-pointer text-2xl animate-pulse"/>
        ) : isLoading ? (
          <BiLoaderCircle className="text-panel-header-icon cursor-pointer text-2xl animate-spin" />
        ) : (
          <MdSend
            title="Send Audio"
            className="text-panel-header-icon cursor-pointer"
            disabled={!recordedAudio}
            onClick={handleSendAudio}
          />
        )}
      </div>
      <audio ref={audioRef} hidden />
    </div>
  );
}

export default CaptureAudio;
