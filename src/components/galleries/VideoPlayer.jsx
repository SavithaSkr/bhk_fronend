import React from "react";

// Utility to extract YouTube video ID from various URL formats
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function VideoPlayer({ youtubeUrl }) {
  const videoId = getYouTubeId(youtubeUrl);

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-black text-white flex items-center justify-center rounded-lg">
        <p>Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full">
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
