"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

const Avatar = ({ type, image, setImage }) => {
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoodinates, setContextMenuCoodinates] = useState({
    x: 0,
    y: 0,
  });
  const [grabphoto, setGrabphoto] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);

  const contextMenuOptions = [
    {
      name: "Take Photo",
      callback: () => {
        setShowCapturePhoto(true)
      },
    },
    {
      name: "Choose From Library",
      callback: () => {
        setShowPhotoLibrary(true);
      },
    },
    {
      name: "Upload Photo",
      callback: () => {
        setGrabphoto(true);
      },
    },
    {
      name: "Remove Photo",
      callback: () => {
        setImage("/default_avatar.png");
      },
    },
  ];
  const showConextMenu = (e) => {
    setContextMenuCoodinates({ x: e.pageX, y: e.pageY });
    setIsContextMenuVisible(true);
  };

  useEffect(() => {
    if (grabphoto) {
      const data = document.getElementById("photo-picker");
      data.click(); // click the input
      document.body.onfocus = (e) => {
        // when photopicker is closed and focus returns to body
        setGrabphoto(false);
      };
    }
  }, [grabphoto]);

  return (
    <>
      <div className="flex items-center justify-center rounded-full overflow-hidden">
        {type === "sm" && (
          <div className="h-10 w-10 relative">
            <Image src={image} alt="avatar" fill />
          </div>
        )}
        {type === "md" && (
          <div className=" h-16 w-16 relative">
            <Image src={image} alt="avatar" fill />
          </div>
        )}
        {type === "lg" && (
          <div className="h-24 w-24 relative">
            <Image src={image} alt="avatar" fill />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {hover && (
              <div className="absolute top-0 left-0 h-60 w-60 bg-photopicker-overlay-background flex flex-col gap-2 items-center justify-center z-10">
                <FaCamera
                  className="text-3xl cursor-pointer"
                  onClick={(e) => showConextMenu(e)}
                  id="context-opener"
                />
                <h3
                  onClick={(e) => showConextMenu(e)}
                  id="context-opener"
                  className="cursor-pointer"
                >
                  change picture
                </h3>
              </div>
            )}
            <div className=" h-60 w-60">
              <Image src={image} alt="avatar" fill />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextMenuCoodinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          setShowPhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {showCapturePhoto && (
        <CapturePhoto
          setImage={setImage}
          setShowCapturePhoto={setShowCapturePhoto}
        />
      )}
    </>
  );
};

export default Avatar;
