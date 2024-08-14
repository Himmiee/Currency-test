import { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

export const CustomDropdown = ({
  countries,
  onSelect,
  selectedCountryCode,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Select a Country");

  const handleSelect = (countryCode, countryName) => {
    setSelectedCountry(countryName);
    setOpen(false);
    onSelect(countryCode);
  };

  // Update the selected country
  useEffect(() => {
    const country = countries.find((c) => c.cca2 === selectedCountryCode);
    setSelectedCountry(country ? country.name.common : "Select a Country");
  }, [selectedCountryCode, countries]);

  return (
    <div className="w-[275px] sm:w-96 relative">
      <div
        className="p-2 mb-4 rounded-md border-gray-600 px-3 border-[1px]"
        onClick={() => setOpen(!open)}
      >
        <div className="flex justify-between items-center text-[15px]">
          {selectedCountry}{" "}
          {!open ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
        </div>
      </div>
      {open && (
        <div className="absolute w-full border-[1px] border-gray-600 rounded-md p-2 flex flex-col bg-white max-h-40 overflow-auto">
          {countries.map((country) => (
            <div
              key={country.cca2}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(country.cca2, country.name.common)}
            >
              {country.name.common}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
