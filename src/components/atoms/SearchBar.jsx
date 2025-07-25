import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Buscar...", 
  onSearch, 
  className = "",
  showSearchButton = true 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 ${className}`}>
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-100 w-5 h-5" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
        />
      </div>
      {showSearchButton && onSearch && (
        <button
          onClick={onSearch}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      )}
    </div>
  );
};

export default SearchBar; 