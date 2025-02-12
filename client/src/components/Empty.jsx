// import Image from "next/image";
import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";

function Empty() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center border-l border-l-conversation-border bg-panel-header-background border-b-4 border-b-icon-green gap-3 text-white">
      <IoLogoWhatsapp className="text-9xl" />
      <span className="text-6xl font-bold">WhatsApp</span>
    </div>
  );
}

export default Empty;
