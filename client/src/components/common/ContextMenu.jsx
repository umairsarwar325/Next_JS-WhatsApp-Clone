"use client";
import React, { useEffect, useRef } from "react";

const ContextMenu = ({ options, coordinates, contextMenu, setContextMenu }) => {
  const contextMenuRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "context-opener") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(event.target)
        ) {
          setContextMenu(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleClick = (e, callback) => {
    e.stopPropagation();
    setContextMenu(false);
    callback();
  };
  return (
    <div
      className={`bg-dropdown-background fixed z-[100] shadow-xl rounded-lg h-28 overflow-x-hidden overflow-y-scroll`}
      ref={contextMenuRef}
      style={{ top: coordinates.y, left: coordinates.x }}
    >
      <ul>
        {options?.map(({ name, callback }) => (
          <li
            className="py-2 px-3 cursor-pointer hover:bg-background-default-hover"
            key={name}
            onClick={(e) => {
              handleClick(e, callback);
            }}
          >
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
