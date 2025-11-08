import React, { useEffect, useRef, useState } from "react";

/**
 * CursorImageTrail
 * - Renders a trail of images following the cursor.
 * - Images alternate in order for a dynamic effect.
 *
 * Props:
 * - images: string[] - list of image URLs to alternate between
 * - count?: number - number of trail elements (default 12)
 * - size?: number - width/height of each image in pixels (default 28)
 * - zIndex?: number - stacking order (default 50)
 * - fade?: boolean - fade older trail items (default true)
 * - excludeSelectors?: string[] - CSS selectors where the trail should be hidden
 */
export default function CursorImageTrail({
  images = [],
  count = 1,
  size = 1,
  zIndex = 50,
  fade = true,
  excludeSelectors = [],
}) {
  const positionsRef = useRef(
    Array.from({ length: count }, () => ({ x: -9999, y: -9999 }))
  );
  const [trail, setTrail] = useState(positionsRef.current);
  const rafLock = useRef(false);

  useEffect(() => {
    const isOverExcluded = (x, y) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return false;
      return excludeSelectors.some((sel) => el.closest(sel));
    };

    const hideTrail = () => {
      const hidden = Array.from({ length: count }, () => ({
        x: -9999,
        y: -9999,
      }));
      positionsRef.current = hidden;
      setTrail(hidden);
    };

    const update = (clientX, clientY) => {
      // throttle updates to next animation frame
      if (rafLock.current) return;
      rafLock.current = true;
      requestAnimationFrame(() => {
        if (isOverExcluded(clientX, clientY)) {
          hideTrail();
        } else {
          const next = [{ x: clientX, y: clientY }, ...positionsRef.current];
          positionsRef.current = next.slice(0, count);
          setTrail(positionsRef.current.map((p) => ({ ...p })));
        }
        rafLock.current = false;
      });
    };

    const onMouseMove = (e) => update(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      const t = e.touches?.[0];
      if (t) update(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [count, excludeSelectors]);

  if (!images.length) return null;

  return (
    <>
      {trail.map((pos, i) => {
        // Alternate images
        const src = images[i % images.length];
        // Optional fading for deeper trail
        const opacity = fade ? Math.max(0.15, 1 - i / (count + 2)) : 1;

        return (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            style={{
              position: "fixed",
              left: pos.x,
              top: pos.y,
              width: size,
              height: size,
              objectFit: "contain",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              userSelect: "none",
              zIndex,
              opacity,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
              transition: "transform 0.06s linear",
            }}
          />
        );
      })}
    </>
  );
}
