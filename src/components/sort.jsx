import { useState } from "react";
import {
  PiSortAscending,
  PiSortDescending,
} from "react-icons/pi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export default function Sort({
  sortOption,
  sortOrder,
  onSortChange,
  onSortOrderToggle,
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "rating", label: "Rating" },
    { value: "caloriesPerServing", label: "Calories" },
    { value: "difficulty", label: "Difficulty" },
  ];

  const getSortLabel = (option) => {
    if (!option) return "Default";
    if (option === "caloriesPerServing") return "Calories";
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
        >
          <span>Sort: {getSortLabel(sortOption)}</span>
          <MdOutlineKeyboardArrowDown size={18} />
        </button>

        {showDropdown && (
          <div className="absolute z-10 mt-2 w-36 bg-white border border-gray-300 rounded-md shadow-lg">
            {sortOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  onSortChange(value);
                  setShowDropdown(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  sortOption === value ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onSortOrderToggle}
        disabled={!sortOption}
        className={`p-2 border rounded-md transition ${
          sortOption
            ? "bg-white hover:bg-gray-100 border-gray-300"
            : "bg-gray-100 border-gray-200 cursor-not-allowed"
        }`}
        title={
          sortOption
            ? `Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`
            : "Select a sort option to enable sort order"
        }
      >
        <div
          className={`transition-transform duration-300 ease-in-out ${
            sortOrder === "asc" ? "rotate-0" : "rotate-180"
          }`}
        >
          <PiSortAscending size={24} />
        </div>
      </button>
    </div>
  );
}
