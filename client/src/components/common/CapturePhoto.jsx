import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

function CapturePhoto({ setImage, setShowCapturePhoto }) {
  const videoRef = useRef(null);

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/jpeg"));
    setShowCapturePhoto(false);
  };

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Ensure the video starts playing
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };
    startCamera();

    return () => {
      stream?.getTracks().forEach(track => {
        track.stop(); // Correctly call the stop method
      });
    };
  }, []);

  return (
    <div className="absolute z-10 h-4/6 w-2/6 top-1/4 left-1/3 bg-gray-900 flex items-center justify-center gap-3 rounded-lg py-2">
      <div className="flex flex-col items-center gap-4 w-full h-full px-3">
        <div
          className="pt-2 pr-2 flex items-end justify-end"
          onClick={() => {
            setShowCapturePhoto(false);
          }}
        >
          <IoClose className="h-6 w-6" />
        </div>
        <div className="flex justify-center">
          <video
            ref={videoRef}
            id="video"
            className="border border-white h-72 w-full"
            autoPlay // Ensure the video starts playing automatically
          ></video>
        </div>
        <button
          onClick={capturePhoto}
          className="h-14 w-14 bg-white rounded-full cursor-pointer border-8 border-teal-light hover:border-teal-400 transition-all duration-300"
        />
      </div>
    </div>
  );
}

export default CapturePhoto;
