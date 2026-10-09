import { useState } from "react";
import highlightTitle from "../utils/highlight";
import Icon from "./Icon";

function PhotoCard({ photo, index, searchTerm, onSelect }) {
  const [failed, setFailed] = useState(false);
  return (
    <article
      className="photo-card"
      style={{ "--reveal-delay": `${Math.min(index, 8) * 45}ms` }}
    >
      <a
        href={photo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="photo-link"
        aria-label={`View larger version of ${photo.title}`}
        onClick={
          onSelect
            ? (event) => {
                event.preventDefault();
                onSelect(photo);
              }
            : undefined
        }
      >
        <div className="photo-image-container">
          {failed ? (
            <span className="image-fallback">
              Image unavailable<span>You can still open the original.</span>
            </span>
          ) : (
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              className="photo-image"
              loading="lazy"
              decoding="async"
              width="600"
              height="480"
              onError={() => setFailed(true)}
            />
          )}
          <div className="photo-overlay">
            <span>Open photo</span>
            <Icon name="expand" />
          </div>
          <span className="photo-number">
            {String(photo.id).padStart(2, "0")}
          </span>
        </div>
        <div className="photo-info">
          <p className="photo-title">
            {highlightTitle(photo.title, searchTerm)}
          </p>
          <Icon name="arrow" />
        </div>
      </a>
    </article>
  );
}

export default function PhotoList({
  photos,
  searchTerm,
  isLoading,
  onSelect,
  spacious = false,
}) {
  const query = searchTerm.trim().toLowerCase();
  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(query),
  );
  if (isLoading)
    return (
      <div className="loading-container">
        <p role="status">Loading photos...</p>
        <div className="photos-grid skeleton-grid" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="skeleton" key={index} />
          ))}
        </div>
      </div>
    );
  if (!filteredPhotos.length)
    return (
      <div className="no-results">
        <span className="eyebrow">No results</span>
        <h3>
          {query
            ? `No photos found matching “${searchTerm}”`
            : "No photographs just yet"}
        </h3>
        <p>Try another title, or clear your search to see the collection.</p>
      </div>
    );
  return (
    <section
      className={`photo-gallery${spacious ? " spacious" : ""}`}
      aria-label="Photo gallery"
    >
      <div className="photos-grid">
        {filteredPhotos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            searchTerm={searchTerm}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
