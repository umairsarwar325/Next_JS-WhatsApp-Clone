import {
  setOnlineUsers,
  setSearchedContacts,
  setUserContacts,
} from "@/store/slices/globalSlice";
import { GET_INITIAL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLIstItem from "./ChatLIstItem";
import { BiLoaderCircle } from "react-icons/bi";

function List() {
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, onlineUsers, userContacts, filteredContacts } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const getContacts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${GET_INITIAL_CONTACTS}/${userInfo?.id}`
        );
        if (data.status) {
          dispatch(setUserContacts(data.users));
          dispatch(setOnlineUsers(data.onlineUsers));
          setIsLoading(false);
        } else {
          throw new Error("Error finding your contacts");
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    if (userInfo?.id) {
      getContacts();
    }
    dispatch(setSearchedContacts(""));
  }, [userInfo]);

  return (
    <div className="w-full min-h-full bg-search-input-container-background flex-auto overflow-auto custom-scrollbar">
      {isLoading && (
        <div className="w-full flex items-center justify-center mt-3">
          <BiLoaderCircle className="text-panel-header-icon cursor-pointer text-3xl animate-spin" />
        </div>
      )}
      {filteredContacts && filteredContacts?.length > 0
        ? filteredContacts?.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))
        : userContacts?.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))}
    </div>
  );
}

export default List;
