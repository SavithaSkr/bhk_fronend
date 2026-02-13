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
      const txt = el.innerText || "";

      const tithiMatch = txt.match(/Tithi\s*[:\-]?\s*([A-Za-z]+)/i);
      const nakMatch = txt.match(/Nakshatra\s*[:\-]?\s*([A-Za-z]+)/i);

      const firstLine =
        txt
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)[0] || "";

      setSummary({
        dateText: firstLine,
        tithi: tithiMatch?.[1] || "",
        nakshatra: nakMatch?.[1] || "",
      });
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

  return (
    <div className="bg-orange-500 text-slate-700 shadow-sm relative z-40 border-b border-slate-200 navbar-header">
      {/* Top compact bar */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white" />
              <span className="font-semibold text-sm text-white">
                {loading
                  ? "Loading Panchangam..."
                  : summary.dateText || "Panchangam"}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-sm text-white">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-white" />
                <span>Tithi: {loading ? "..." : summary.tithi || "—"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Moon className="w-3 h-3 text-white" />
                <span>
                  Nakshatra: {loading ? "..." : summary.nakshatra || "—"}
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
      </div>

      {/* ✅ IMPORTANT: container always exists. We only hide/show it. */}
      <div
        className={`bg-orange-100/50 backdrop-blur-sm border-t border-slate-200 ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div
            ref={containerRef}
            id={TARGET_ID}
            className="bg-white/80 rounded-lg p-3 overflow-x-auto min-h-[90px]"
          />
          {loading && (
            <div className="text-xs text-slate-500 mt-2">
              Loading widget from mypanchang.com...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
