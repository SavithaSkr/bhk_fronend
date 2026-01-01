import { useEffect } from "react";

export default function JotFormEmbed({
  formId,
  formUrl,
  height = "539px",
}) {

  useEffect(() => {
    // Load JotForm Embed Script
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.jotformEmbedHandler) {
        window.jotformEmbedHandler(
          `iframe[id='JotFormIFrame-${formId}']`,
          "https://form.jotform.com/"
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [formId]);

  return (
    <iframe
      id={`JotFormIFrame-${formId}`}
      title="JotForm"
      allow="geolocation; microphone; camera; fullscreen; payment"
      onLoad={() => window?.parent?.scrollTo(0, 0)}
      src={formUrl}
      style={{
        minWidth: "100%",
        maxWidth: "100%",
        height: height,
        border: "none",
      }}
      frameBorder="0"
      scrolling="no"
    ></iframe>
  );
}
