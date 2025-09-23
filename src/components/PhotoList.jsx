import highlightTitle from "../utils/highlight";

function PhotoList({ photos, searchTerm, isLoading }) {
  const filteredPhotos = searchTerm 
    ? photos.filter(photo => 
        photo.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : photos;
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" role="status" aria-label="Loading photos"></div>
        <p className="loading-text">Loading beautiful photos...</p>
      </div>
    );
  }

  if (filteredPhotos.length === 0 && searchTerm) {
    return (
      <div className="no-results">
        <p className="no-results-text">No photos found matching "{searchTerm}"</p>
        <p className="no-results-suggestion">Try searching for something else!</p>
      </div>
    );
  }

  return (
    <section className="photo-gallery" aria-label="Photo gallery" role="main">
      <div className="photos-grid">
        {filteredPhotos.map((p) => (
          <article key={p.id} className="photo-card" role="article">
            <a 
              href={p.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="photo-link"
              aria-label={`View larger version of ${p.title}`}
            >
              <div className="photo-image-container">
                <img 
                  src={p.thumbnailUrl} 
                  alt={p.title} 
                  className="photo-image"
                  loading="lazy"
                />
                <div className="photo-overlay">
                  <span className="photo-zoom-icon">🔍</span>
                </div>
              </div>
            </a>
            <div className="photo-info">
              <p className="photo-title">{highlightTitle(p.title, searchTerm)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PhotoList;
