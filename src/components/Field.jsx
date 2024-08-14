import axios from "axios";
import { CustomDropdown } from "./CustomDropdown";
import { useState, useEffect } from "react";

export const FieldComponent = () => {
  const [countryName, setCountryName] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("SYM");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const baseUrl = "https://restcountries.com/v3.1/all";

  // Fetch the country data
  const getCountry = async () => {
    try {
      const response = await axios.get(baseUrl);
      if (response.status === 200) {
        const countries = response.data;
        countries.sort((a, b) => (a.name.common > b.name.common ? 1 : -1));
        setCountryName(countries);
      } else {
        setCountryName([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearFields = () => {
    setInputValue("");
    setSelectedCountryCode("");
    setCurrencySymbol("SYM");
  };

  // Format numbers for proper display
  const formatNumberWithCommas = (number) => {
    if (!number) return "";
    const parsedNumber = parseFloat(number.replace(/,/g, ""));
    if (isNaN(parsedNumber)) return "";
    return parsedNumber.toLocaleString();
  };

  // Handle symbol selection based on country
  const handleCountryChange = (countryCode) => {
    setSelectedCountryCode(countryCode);
    const selectedCountry = countryName.find(
      (country) => country.cca2 === countryCode
    );

    const symbol = selectedCountry?.currencies
      ? Object.values(selectedCountry.currencies)[0]?.symbol || ""
      : "NAN";

    setCurrencySymbol(symbol);
  };

  useEffect(() => {
    getCountry();
  }, []);

  return (
    <div className="bg-white rounded-2xl h-[450px] sm:w-[700px] w-96">
      <div className="flex flex-col justify-center items-center p-6">
        <h1 className="my-6 text-xl font-bold">
          Currency <span className="text-green-600 italic">Converter</span>
        </h1>
        <CustomDropdown
          countries={countryName}
          onSelect={handleCountryChange}
          selectedCountryCode={selectedCountryCode}
        />
        <div className="flex items-center gap-4 border-[1px] w-[275px] sm:w-96 rounded-lg border-gray-600 px-2 text-gray-700">
          <div className="border-r-[1px] w-1/5 border-gray-600 flex justify-center">
            {currencySymbol}
          </div>
          <input
            type="text"
            placeholder={
              currencySymbol !== "SYM"
                ? "Please enter an amount"
                : "Pick a country first"
            }
            value={
              currencySymbol !== "SYM" ? formatNumberWithCommas(inputValue) : ""
            }
            className="py-[7px] outline-none w-full"
            onChange={(e) => {
              if (currencySymbol !== "SYM") {
                const unformattedValue = e.target.value.replace(/,/g, "");
                setInputValue(unformattedValue);
              }
            }}
          />
        </div>

        <div
          onClick={clearFields}
          className="bg-green-700 w-1/3 my-6 h-10 flex justify-center items-center hover:bg-green-600 cursor-pointer text-white rounded-md"
        >
          Clear Fields
        </div>
        <div className="my-6 text-xl">
          {currencySymbol !== "NAN" &&
            inputValue &&
            `${currencySymbol} ${formatNumberWithCommas(inputValue)}`}
        </div>
      </div>
    </div>
  );
};
