import React, { useState } from "react";
import colors from "../data/colorNames.json";

const ColorLibrary = () => {
  const [search, setSearch] = useState("");

  const filteredColors = colors.filter(color =>
    color.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 p-10">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Color Library
      </h1>

      {/* Search */}
      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search color..."
          className="w-full px-4 py-3 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredColors.slice(0, 300).map((color, index) => (
          <div
            key={index}
            className="rounded-xl shadow-md overflow-hidden group hover:scale-105 transition"
          >
            <div
              className="h-24"
              style={{ backgroundColor: color.hex }}
            />
            <div className="p-3 bg-white dark:bg-navy-900">
              <p className="text-sm font-semibold truncate">
                {color.name}
              </p>
              <p className="text-xs text-gray-500">
                {color.hex}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorLibrary;
