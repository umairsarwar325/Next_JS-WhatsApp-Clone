import React from "react";
import { IoClose } from "react-icons/io5";
import Avatar from "./Avatar";

function PhotoLibrary({ setImage, setShowPhotoLibrary }) {
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];

  return (
    <div className="fixed top-0 left-0 max-h-[100vh] max-w-[100vw] h-full w-full flex justify-center items-center overflow-y-scroll">
      <div className="h-max w-max bg-gray-900 flex flex-col gap-4 rounded-lg p-4 cursor-pointer">
        <div>
          <div
            className="pt-2 pr-2 flex items-end justify-end"
            onClick={() => {
              setShowPhotoLibrary(false);
            }}
          >
            <IoClose className="h-6 w-6" />
          </div>
          <div className="grid grid-cols-3 justify-center items-center gap-14 p-14 w-full">
            {images.map((image, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setShowPhotoLibrary(false);
                  setImage(image);
                }}
              >
                <Avatar type={"lg"} image={image}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;
