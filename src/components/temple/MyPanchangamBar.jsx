import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown, Star, Moon } from "lucide-react";

export default function MyPanchangamBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    dateText: "",
    tithi: "",
    nakshatra: "",
  });

  const containerRef = useRef(null);

  const LOC_ID = import.meta.env.VITE_MYPANCHANG_LOCID; // must exist in .env + GitHub env
  const TARGET_ID = "mypanchang-feed-container";

  const scriptSrc = useMemo(
    () => "https://www.mypanchang.com/displaypanchang.js",
    []
  );

  useEffect(() => {
    if (!LOC_ID) {
      console.error("VITE_MYPANCHANG_LOCID is missing in env");
      setLoading(false);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    // Ensure container has correct id (some refs can mount before id is applied)
    el.id = TARGET_ID;

    // Clear previous content
    el.innerHTML = "";
    setLoading(true);

    // Remove any previous injected script
    const existing = document.querySelector(
      `script[src="${scriptSrc}"][data-react-mypanchang="1"]`
    );
    if (existing) existing.remove();

    // Inject script AFTER container is ready
    const s = document.createElement("script");
    s.src = scriptSrc;
    s.async = true;
    s.setAttribute("data-react-mypanchang", "1");
    s.setAttribute("data-target-id", TARGET_ID);
    s.setAttribute("data-locid", LOC_ID);

    s.onload = () => {
      // widget renders after load; allow some time
      setTimeout(() => {
        setLoading(false);
      }, 800);
    };

    s.onerror = () => {
      console.error("mypanchang script failed to load");
      setLoading(false);
    };

    document.body.appendChild(s);

    // Observe changes in widget output to extract summary
const observer = new MutationObserver(() => {
  const basic = el.querySelector("#basicdata");
  const rkym = el.querySelector("#rkym");
  const other = el.querySelector("#otherdetails");
  const vratams = el.querySelector("#vratams");

  if (basic) {
    // Build clean HTML manually
    const cleanedHTML = `
      <div>
        ${basic?.innerHTML || ""}
        ${rkym?.innerHTML || ""}
        ${other?.innerHTML || ""}
        ${vratams?.innerHTML || ""}
      </div>
    `;

    // Replace FULL widget with only required content
    el.innerHTML = cleanedHTML;

    // Stop observing after cleaning
    observer.disconnect();
    setLoading(false);
  }
});



observer.observe(el, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const injected = document.querySelector(
        `script[src="${scriptSrc}"][data-react-mypanchang="1"]`
      );
      if (injected) injected.remove();
    };
  }, [LOC_ID, scriptSrc]);
const today = new Date();

const formattedDate = today.toLocaleDateString(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
  return (
    <div className="bg-orange-500 text-slate-700 shadow-sm relative z-40 border-b border-slate-200 navbar-header">
      {/* Top compact bar */}
      {/* <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-white mt-1">{formattedDate}</span>

            </div>

            <div className="hidden md:flex items-center gap-4 text-sm text-white">
              <div className="flex items-center gap-1">
                <span>
                  Today Panchangam
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="flex items-center gap-2 text-white hover:text-slate-800 transition-colors"
          >
            <span className="text-xs hidden sm:block">
              {isExpanded ? "Less info" : "More info"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div> */}

      {/* ✅ IMPORTANT: container always exists. We only hide/show it. */}
      {/* <div
        className={`bg-orange-100/50 backdrop-blur-sm border-t border-slate-200 ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div
  ref={containerRef}
  id={TARGET_ID}
  className="bg-white rounded-lg p-4 shadow-sm"
  style={{
    minHeight: "120px"
  }}
/>
          {loading && (
            <div className="text-xs text-slate-500 mt-2">
              Loading widget from mypanchang.com...
            </div>
          )}
          {error && (
            <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
