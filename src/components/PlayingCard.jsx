import React from "react";

/**
 * PlayingCard component
 * Renders an image for a face-up playing card or the shared card back image.
 */
export default function PlayingCard({ card, faceDown = false, alt = "playing card", slot = 0, animating = false }) {
  // Build the expected filename from the card object: e.g. "ace_of_spades.png"
  const namePart = card ? String(card.name).toLowerCase() : "back";
  const suitPart = card ? String(card.suit).toLowerCase() : "";

  // Use the requested public back-side image when the card is face-down
  const backImage = "/assets/playing-card-back-side.png";
  const src = faceDown || !card ? backImage : `/assets/${namePart}_of_${suitPart}.png`;

  // Use a CSS class so the parent can trigger a smooth reveal animation
  const className = animating ? "playing-card reveal-card" : "playing-card";

  return (
    <div className={className} data-slot={slot} aria-label={alt}>
      <img
        src={src}
        alt={alt}
        onError={(e) => {
          // If the card face image fails to load, fallback to the official back-side image
          e.currentTarget.onerror = null;
          e.currentTarget.src = backImage;
        }}
      />
    </div>
  );
}

// PropTypes removed to avoid adding new dependencies in the starter project
