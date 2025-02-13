import { GET_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiLoaderCircle, BiSearchAlt2 } from "react-icons/bi";
import { setAllContactsPage } from "@/store/slices/globalSlice";
import { useDispatch } from "react-redux";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState("");
  const [searchedContacts, setSearchedContacts] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(GET_CONTACTS);
        if (data?.status) {
          setAllContacts(data.userGroup);
          setSearchedContacts(data.userGroup);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    if (searchedTerm.length) {
      const filteredData = {};
      Object.keys(allContacts).forEach(
        (key) =>
          (filteredData[key] = allContacts[key].filter((obj) =>
            obj.name.toLowerCase().includes(searchedTerm.toLowerCase())
          ))
      );
      setSearchedContacts(filteredData);
    } else {
      setSearchedContacts(allContacts);
    }
  }, [searchedTerm]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-16 flex items-center px-3 py-4">
        <div className="flex items-center gap-6 text-panel-header-icon">
          <BiArrowBack
            className="cursor-pointer text-xl"
            title="Back"
            onClick={() => {
              dispatch(setAllContactsPage());
            }}
          />
          <h2 className="text-panel-header-icon font-bold text-2xl">
            WhatsApp
          </h2>
        </div>
      </div>
      <div className="flex items-center px-3 w-full">
        <span className="text-white font-semibold text-lg">New Chat</span>
      </div>
      <div className="bg-search-input-container-background flex justify-center items-start pt-3 px-2 gap-3">
        <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
          <div>
            <BiSearchAlt2
              className="text-panel-header-icon cursor-pointer text-lg"
              title="Search"
            />
          </div>
          <div className="w-full">
            <input
              value={searchedTerm}
              onChange={(e) => {
                setSearchedTerm(e.target.value);
              }}
              type="text"
              placeholder="Search contacts"
              className="bg-transparent text-sm focus:outline-none text-white w-full"
            />
          </div>
        </div>
      </div>
      <div className="bg-search-input-container-background flex flex-col justify-start items-start py-3 px-2 gap-3 h-full custom-scrollbar w-full">
        {isLoading && (
          <div className="w-full flex items-center justify-center mt-3">
            <BiLoaderCircle className="text-panel-header-icon cursor-pointer text-3xl animate-spin" />
          </div>
        )}
        {Object.entries(searchedContacts).map(([intialLetter, userList]) => {
          return (
            userList?.length > 0 && (
              <div key={Date.now() + intialLetter} className="py-2 pl-6 w-full">
                <div className="text-teal-light text-base">{intialLetter}</div>
                {userList.map((contact) => {
                  return (
                    <ChatLIstItem
                      data={contact}
                      isContactPage={true}
                      key={contact.id}
                    />
                  );
                })}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
