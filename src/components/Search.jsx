import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getMovieRecommendations } from "../services/gemini";

const Search = ({ setSearchTerm, setGeminiRecommendations }) => {
  const [numberOfFields, setNumberOfFields] = useState(1);
  const [searchTerms, setSearchTerms] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [options] = useState([
    { value: 1, label: "1 person watching" },
    { value: 2, label: "2 friends watching" },
    { value: 3, label: "3 friends watching" },
    { value: 4, label: "4 friends watching" },
    { value: 5, label: "5 friends watching" },
  ]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const validTerms = searchTerms.filter((term) => term.trim() !== "");
      if (validTerms.length > 0) {
        try {
          setIsLoading(true);
          setError("");
          const recommendations = await getMovieRecommendations(validTerms);
          setGeminiRecommendations(recommendations);
        } catch (error) {
          console.error(`Error recommending movies: ${error}`);
          setError("Failed to get recommendations. Please try again.");
          setGeminiRecommendations([]);
        } finally {
          setIsLoading(false);
        }
      }
    }, 1500);

    return () => clearTimeout(handler);
  }, [searchTerms, setGeminiRecommendations]);

  const handleFieldCountChange = (selectedOption) => {
    const count = selectedOption.value;
    setNumberOfFields(count);
    setSearchTerms((prev) => {
      const newTerms = [...prev];
      while (newTerms.length < count) newTerms.push("");
      while (newTerms.length > count) newTerms.pop();
      return newTerms;
    });
  };

  const handleInputChange = (index, value) => {
    const newTerms = [...searchTerms];
    newTerms[index] = value;
    setSearchTerms(newTerms);
    setSearchTerm(newTerms.filter((t) => t).join(", "));
  };

  return (
    <div className="search">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img src="search.svg" alt="Search" className="relative top-1" />
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={options}
            defaultValue={options}
            onChange={handleFieldCountChange}
            isSearchable={false}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#0f0d23",
                borderColor: "#a8b5db33",
                minWidth: "200px",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#cecefb",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#0f0d23",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#a8b5db1a" : "#0f0d23",
                color: "#cecefb",
              }),
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          {Array.from({ length: numberOfFields }).map((_, index) => (
            <div key={index} className="relative">
              <input
                type="text"
                placeholder={`Search term ${index + 1}`}
                value={searchTerms[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full bg-dark-100/50 border border-light-200/20 rounded-lg py-3 px-4 text-gray-200 placeholder-light-200/50 focus:outline-none focus:border-light-200/50 transition-colors"
              />
              {index > 0 && (
                <button
                  onClick={() => {
                    const newTerms = [...searchTerms];
                    newTerms.splice(index, 1);
                    setSearchTerms(newTerms);
                    setNumberOfFields((prev) => prev - 1);
                  }}
                  className="absolute right-3 top-3 text-light-200/50 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="text-center text-light-200/60 animate-pulse">
            Analyzing preferences and generating recommendations...
          </div>
        )}
        {error && (
          <div className="text-red-400 bg-red-900/20 p-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
