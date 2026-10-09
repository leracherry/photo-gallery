import { useState } from "react";
import Icon from "./Icon";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  function update(next) {
    setValue(next);
    onSearch(next);
  }
  return (
    <div className="search-container" role="search">
      <label htmlFor="photo-search" className="sr-only">
        Search photos by title
      </label>
      <Icon name="search" />
      <input
        id="photo-search"
        type="search"
        className="search-input"
        placeholder="Search photos by title..."
        aria-label="Search photos by title"
        autoComplete="off"
        data-testid="search-input"
        value={value}
        onChange={(event) => update(event.target.value)}
      />
      {value && (
        <button
          className="icon-button clear-search"
          aria-label="Clear search"
          onClick={() => update("")}
        >
          <Icon name="close" />
        </button>
      )}
    </div>
  );
}
