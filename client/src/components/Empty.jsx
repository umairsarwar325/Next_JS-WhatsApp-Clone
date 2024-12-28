import Image from "next/image";
import React from "react";

function Empty() {
  return <div className="w-full h-full flex flex-col items-center justify-center border-l border-l-conversation-border bg-panel-header-background border-b-4 border-b-icon-green" >
    <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300}/>
  </div>;
}

export default Empty;
