import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

function LightboxImage({ photo }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <p>
      We couldn’t load this photograph.{" "}
      <a href={photo.url} target="_blank" rel="noopener noreferrer">
        Open the original
      </a>
    </p>
  ) : (
    <img src={photo.url} alt={photo.title} onError={() => setFailed(true)} />
  );
}

export default function Lightbox({
  photo,
  onClose,
  onPrevious,
  onNext,
  position,
  total,
}) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  function handleKeys(event) {
    if (event.key === "Tab") {
      const controls = [...dialog.current.querySelectorAll("button, a[href]")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight")
      event.preventDefault();
    if (event.key === "ArrowLeft") onPrevious();
    if (event.key === "ArrowRight") onNext();
  }
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-labelledby="lightbox-title"
      onCancel={onClose}
      onKeyDown={handleKeys}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lightbox-inner">
        <div className="lightbox-top">
          <span className="eyebrow">A moment, in focus</span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close photo"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="lightbox-image">
          <LightboxImage key={photo.id} photo={photo} />
        </div>
        <div className="lightbox-bottom">
          <div>
            <p id="lightbox-title">{photo.title}</p>
            <span>
              {position + 1} / {total} · Use ← → to explore
            </span>
          </div>
          <div className="lightbox-navigation">
            <button
              className="icon-button previous"
              onClick={onPrevious}
              aria-label="Previous photo"
            >
              <Icon name="arrow" />
            </button>
            <button
              className="icon-button"
              onClick={onNext}
              aria-label="Next photo"
            >
              <Icon name="arrow" />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
