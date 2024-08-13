import axios from "axios";
import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";

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

        // Sort countries alphabetically by name
        countries.sort((a, b) => (a.name.common > b.name.common ? 1 : -1));

        setCountryName(countries);

        // Reset the currency symbol if no default country is selected
        setCurrencySymbol("SYM");
      } else {
        setCountryName([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCountry();
  }, []);

  // Handle country selection and Symbol
  const handleCountryChange = (event) => {
    const selectedCountryCode = event.target.value;
    setSelectedCountryCode(selectedCountryCode);

    const selectedCountry = countryName.find(
      (country) => country.cca2 === selectedCountryCode
    );

    if (selectedCountry && selectedCountry.currencies) {
      const currencyCodes = Object.keys(selectedCountry.currencies);
      if (currencyCodes.length > 0) {
        const currencyCode = currencyCodes[0];
        const symbol = selectedCountry.currencies[currencyCode].symbol || "";
        setCurrencySymbol(symbol);
      }
    } else {
      setCurrencySymbol("SYM");
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    // Remove any non-numeric characters except for period
    const cleanValue = value.replace(/[^0-9.]/g, "");

    // Format the value to currency format
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(cleanValue);

    setInputValue(formattedValue);
  };

  return (
    <div className="bg-white h-[450px] sm:w-[700px] w-96  rounded-md">
      <div className="flex flex-col justify-center items-center p-6 ">
        <h1 className="mt-2 mb-6 text-xl font-bold">
          Currency <span className="text-green-600 italic">Converter</span>
        </h1>
        <div className="border-gray-600 border-[1px] p-2 rounded-lg my-6 text-gray-700">
          <select
            name="country"
            id="country"
            className="outline-none w-64"
            value={selectedCountryCode}
            onChange={handleCountryChange}
          >
            <option value="">Select a country</option>
            {countryName?.map((country, index) => (
              <option key={index} value={country.cca2}>
                {country.name.common}
              </option>
            ))}
          </select>
        </div>
        <div className=" flex items-center gap-4 border-[1px] w-[275px] rounded-lg border-gray-600 px-2 text-gray-700 ">
          <div className=" border-r-[1px] w-1/5 border-gray-600 flex justify-center">
            {currencySymbol}
          </div>{" "}
          {/* Display the currency symbol or "Sym" text */}
          <CurrencyInput
            placeholder="Please enter an amount"
            defaultValue={0}
            decimalsLimit={2}
            className=" py-[7px] outline-none no-spinner"
            onValueChange={(value, name, values) => setInputValue(name)}
          />
        </div>
      </div>
    </div>
  );
};
