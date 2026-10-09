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
        <a className="wordmark" href="#" aria-label="Still, Photo Gallery home">
          still<span className="brand-dot">.</span>
        </a>
        <span className="header-note">
          A small collection of beautiful things
        </span>
        <a className="collection-link" href="#collection">
          Explore collection <Icon name="arrow" />
        </a>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-line" /> THE ART OF NOTICING
            </p>
            <h1 id="hero-title">
              Life moves fast.
              <br />
              <em>Stay a little still.</em>
            </h1>
            <p className="hero-description">
              Discover beautiful photos from around the world.
              <br /> A place for quiet details, open skies, and a different
              perspective.
            </p>
            <a className="hero-action" href="#collection">
              Find your next moment{" "}
              <span>
                <Icon name="arrow" />
              </span>
            </a>
            <div className="hero-caption">
              <span className="small-star" aria-hidden="true">
                ✳
              </span>
              <p>
                Less scrolling. More seeing.
                <br />
                <span>Made for the curious eye.</span>
              </p>
            </div>
          </div>
          <figure className="hero-image">
            <img
              src="https://picsum.photos/id/29/1000/1200"
              alt="Quiet mountain landscape under an open sky"
              width="1000"
              height="1200"
              fetchPriority="high"
            />
            <figcaption>
              <span>THE WORLD, UNHURRIED</span>
              <span>01 / A different perspective</span>
            </figcaption>
            <div className="image-label">
              Pause.
              <br />
              <em>Look closer.</em>
            </div>
          </figure>
        </section>
        <section
          id="collection"
          className="collection"
          aria-labelledby="collection-title"
          tabIndex="-1"
        >
          <div className="collection-heading">
            <div>
              <p className="eyebrow">THE COLLECTION</p>
              <h2 id="collection-title">
                A world worth looking at<span>.</span>
              </h2>
            </div>
            <p className="collection-count" aria-live="polite">
              {isLoading
                ? "Gathering moments…"
                : error
                  ? "Collection unavailable"
                  : `${filtered.length} ${filtered.length === 1 ? "photograph" : "photographs"}${searchTerm.trim() ? ` / ${photos.length}` : " to explore"}`}
            </p>
          </div>
          <div className="toolbar">
            <SearchBar onSearch={setSearchTerm} />
            <div className="view-controls">
              <span>Give it room</span>
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
              <h3>A moment of interruption.</h3>
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
        <div>
          <span className="wordmark">
            still<span className="brand-dot">.</span>
          </span>
          <p>Every picture is a reason to pause.</p>
        </div>
        <p className="footer-note">
          PHOTO GALLERY · BUILT WITH CURIOSITY
          <br />
          <a
            href="https://picsum.photos"
            target="_blank"
            rel="noopener noreferrer"
          >
            Photography via Lorem Picsum ↗
          </a>
        </p>
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
