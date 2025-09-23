import { useEffect, useState } from "react";
import PhotoList from "./components/PhotoList";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/albums/1/photos");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPhotos(
        data.map((photo) => ({
          ...photo,
          // Use the EXACT same URL for both thumbnail and full size
          // This guarantees the same image every time
          thumbnailUrl: `https://picsum.photos/id/${photo.id}/600/600`,
          url: `https://picsum.photos/id/${photo.id}/1200/1200`,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">📸 Photo Gallery</h1>
        <p className="app-subtitle">Discover beautiful photos from around the world</p>
      </header>
      
      <main className="app-main">
        <div className="search-section">
          <SearchBar onSearch={setSearchTerm} />
        </div>
        
        <PhotoList photos={photos} searchTerm={searchTerm} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
