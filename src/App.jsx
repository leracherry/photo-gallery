import { useEffect, useState } from "react";
import PhotoList from "./components/PhotoList";
import SearchBar from "./components/SearchBar";
import Lightbox from "./components/Lightbox";
import Icon from "./components/Icon";
import "./App.css";

const endpoint = "https://jsonplaceholder.typicode.com/albums/1/photos";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [spacious, setSpacious] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadPhotos() {
      try {
        const response = await fetch(endpoint);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (
          !Array.isArray(data) ||
          data.some(
            (photo) =>
              !Number.isInteger(photo.id) || typeof photo.title !== "string",
          )
        )
          throw new Error("Invalid photo response");
        if (active)
          setPhotos(
            data.map((photo) => ({
              ...photo,
              thumbnailUrl: `https://picsum.photos/id/${photo.id}/600/480`,
              url: `https://picsum.photos/id/${photo.id}/1600/1280`,
            })),
          );
      } catch (err) {
        if (active) {
          console.error("Failed to fetch photos:", err);
          setError("The collection couldn’t load. Let’s try that again.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadPhotos();
    return () => {
      active = false;
    };
  }, [attempt]);

  const filtered = photos.filter((photo) =>
    photo.title.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );
  const position = filtered.findIndex((photo) => photo.id === selectedId);
  const selected = filtered[position];
  function move(direction) {
    setSelectedId(
      filtered[(position + direction + filtered.length) % filtered.length].id,
    );
  }
  function retry() {
    setError("");
    setIsLoading(true);
    setAttempt((value) => value + 1);
  }
  return (
    <div className="app">
      <a className="skip-link" href="#collection">
        Skip to collection
      </a>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Photo Gallery home">
          photo-gallery
        </a>
        <a
          className="collection-link"
          href="https://github.com/leracherry/photo-gallery"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <Icon name="arrow" />
        </a>
      </header>
      <main>
        <section className="intro" aria-labelledby="gallery-title">
          <h1 id="gallery-title">Photo Gallery</h1>
          <p className="intro-description">
            Browse photos, search by title, and open one for a closer look.
          </p>
        </section>
        <section
          id="collection"
          className="collection"
          aria-labelledby="collection-title"
          tabIndex="-1"
        >
          <div className="collection-heading">
            <div>
              <h2 id="collection-title">Photos</h2>
            </div>
            <p className="collection-count" aria-live="polite">
              {isLoading
                ? "Loading photos…"
                : error
                  ? "Collection unavailable"
                  : `${filtered.length} ${filtered.length === 1 ? "photograph" : "photographs"}${searchTerm.trim() ? ` / ${photos.length}` : ""}`}
            </p>
          </div>
          <div className="toolbar">
            <SearchBar onSearch={setSearchTerm} />
            <div className="view-controls">
              <span>Grid size</span>
              <button
                className="icon-button"
                aria-label="Toggle spacious grid"
                aria-pressed={spacious}
                onClick={() => setSpacious((value) => !value)}
              >
                <Icon name="grid" />
              </button>
            </div>
          </div>
          {error ? (
            <div className="no-results" role="alert">
              <h3>Couldn’t load photos.</h3>
              <p>{error}</p>
              <button className="retry-button" onClick={retry}>
                Try again <Icon name="arrow" />
              </button>
            </div>
          ) : (
            <PhotoList
              photos={photos}
              searchTerm={searchTerm}
              isLoading={isLoading}
              spacious={spacious}
              onSelect={(photo) => setSelectedId(photo.id)}
            />
          )}
        </section>
      </main>
      <footer className="site-footer">
        <p>A small React project.</p>
        <a
          href="https://picsum.photos"
          target="_blank"
          rel="noopener noreferrer"
        >
          Photos from Lorem Picsum ↗
        </a>
      </footer>
      {selected && (
        <Lightbox
          photo={selected}
          position={position}
          total={filtered.length}
          onClose={() => setSelectedId(null)}
          onPrevious={() => move(-1)}
          onNext={() => move(1)}
        />
      )}
    </div>
  );
}
