import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";

function SearchBar() {
  return (
    <div className="bg-search-input-container-background flex justify-center items-center py-3 px-2 gap-3">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2
            className="text-panel-header-icon cursor-pointer text-lg"
            title="Search"
          />
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
          />
        </div>
      </div>
      <div>
        <BsFilter
          className="text-panel-header-icon cursor-pointer text-lg"
          title="Search"
        />
      </div>
    </div>
  );
}

export default SearchBar;
