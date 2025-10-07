function SearchBar({onSearch}){
    return(
        <div className="search-container" role="search">
            <label htmlFor="photo-search" className="search-label sr-only">
                Search photos by title
            </label>
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    id="photo-search"
                    type="text"
                    className="search-input"
                    placeholder="Search photos by title..."
                    onChange ={(e)=>onSearch(e.target.value)}
                    aria-label="Search photos by title"
                    autoComplete="off"
                    data-testid="search-input"
                />
            </div>
        </div>
    )
}

export default SearchBar;   