import React, { useMemo, useEffect, useState } from "react";

export default function MyPanchangamHomeWidget() {
  const locid = import.meta.env.VITE_MYPANCHANG_LOCID || "4259418";
  

  const srcDoc = useMemo(() => {
    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    html, body { margin:0; padding:0; background:transparent; }
    body{
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color:#0f172a;
    }

    /* Hide raw widget output (we will parse it) */
    #raw{
      position:absolute;
      left:-99999px;
      top:-99999px;
      width:1px;
      height:1px;
      overflow:hidden;
      opacity:0;
      pointer-events:none;
      white-space:pre-wrap;
    }

    .wrap{ padding:14px 16px; }
    .grid{
      display:grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px 16px;
    }
    @media (max-width: 560px){
      .grid{ grid-template-columns: 1fr; }
    }

    .item{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:10px 12px;
      border:1px solid rgba(249,115,22,.18);
      background: rgba(255,255,255,.92);
      border-radius: 14px;
      box-shadow: 0 10px 20px rgba(2,6,23,.06);
    }
    .label{
      font-weight:700;
      font-size: 13px;
      letter-spacing:.06em;
      text-transform: uppercase;
      color:#ea580c;
      white-space:nowrap;
    }
    .value{
      font-weight:600;
      font-size: 14px;
      color:#0f172a;
      text-align:right;
    }

    .meta{
      display:flex;
      flex-wrap:wrap;
      gap:10px 14px;
      margin-bottom:12px;
      color:#475569;
      font-size: 13px;
    }
    .pill{
      background: rgba(249,115,22,.10);
      border: 1px solid rgba(249,115,22,.20);
      padding: 6px 10px;
      border-radius: 999px;
      font-weight:600;
    }

    .loading{
      font-size: 14px;
      color:#64748b;
      padding: 18px 0;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div id="meta" class="meta"></div>
    <div id="pretty" class="loading">Loading Panchangam…</div>
    <div id="raw"></div>
  </div>

  <script>
    function postHeight(){
      const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      parent.postMessage({ type: "MYPANCHANG_HEIGHT", height: h }, "*");
    }

    // Parse helpers
    function cleanLine(s){ return (s||"").replace(/\\s+/g," ").trim(); }

    function findLine(lines, startsWithArr){
      for (const sw of startsWithArr){
        const l = lines.find(x => x.toUpperCase().startsWith(sw.toUpperCase()));
        if (l) return l;
      }
      return "";
    }

    function extractTimeRange(line){
      // e.g. "RK:10:14-15:11:36:20" or "YM:14:20:29 - 15:42:33"
      const s = line.replace(/\\s/g,"");
      const idx = s.indexOf(":");
      if (idx === -1) return "";
      const rhs = s.slice(idx+1);
      // normalize separators
      return rhs.replace("--","-").replace("—","-");
    }

    function buildUI(text){
      const pretty = document.getElementById("pretty");
      const meta = document.getElementById("meta");

      const lines = text
        .split(/\\r?\\n/)
        .map(cleanLine)
        .filter(Boolean);

      // Meta (location/date)
      const loc = lines[0] || "";
      const date = findLine(lines, ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]) || "";
      meta.innerHTML = "";
      if (loc) meta.insertAdjacentHTML("beforeend", '<span class="pill">'+loc+'</span>');
      if (date) meta.insertAdjacentHTML("beforeend", '<span class="pill">'+date+'</span>');

      // Extract key fields (best-effort based on your current dump)
      // Sunrise/Sunset line looks like: "☼ 07:30:07 - 18:26:42 ☽ 09:19:30 - 23:29:58"
      const sunMoonLine = lines.find(l => l.includes("☼") || l.includes("☽")) || "";
      let sunrise = "", sunset = "", moonrise="", moonset="";
      if (sunMoonLine){
        // try to pull times in order
        // Example: "☼ 07:30:07 - 18:26:42 ☽ 09:19:30 - 23:29:58"
        const parts = sunMoonLine.replace(/\\s+/g," ").split(" ");
        // crude parse:
        // find after ☼ then times
        const sunIdx = parts.indexOf("☼");
        const moonIdx = parts.indexOf("☽");
        if (sunIdx !== -1){
          sunrise = parts[sunIdx+1] || "";
          // sometimes "-" is separate token
          let dash = parts[sunIdx+2] === "-" ? 1 : 0;
          sunset = parts[sunIdx+2+dash] || "";
        }
        if (moonIdx !== -1){
          moonrise = parts[moonIdx+1] || "";
          let dash = parts[moonIdx+2] === "-" ? 1 : 0;
          moonset = parts[moonIdx+2+dash] || "";
        }
      }

      const tithiLine = findLine(lines, ["TITHI", "PANCHAMI", "SHUKLA", "KRISHNA"]) || ""; // widget sometimes puts tithi names directly
      // Your dump includes e.g. "PHALGUNA SHUKLA PAKSHA"
      const pakshaLine = lines.find(l => l.includes("PAKSHA")) || "";

      const nakLine = lines.find(l => l.includes("TILL") && (l.toLowerCase().includes("revati") || l.toLowerCase().includes("ashwini") || l.toLowerCase().includes("bharani") || l.toLowerCase().includes("krittika") || l.toLowerCase().includes("rohini") || l.toLowerCase().includes("mrigashira"))) || "";
      // fallback: any line with "TILL" that looks like nakshatra
      const nakFallback = nakLine || (lines.find(l => l.includes("TILL") && l.length < 40) || "");

      const rahu = extractTimeRange(findLine(lines, ["RK:","RAHU"]) || "");
      const yama = extractTimeRange(findLine(lines, ["YM:","YAM"]) || "");
      const dur = extractTimeRange(findLine(lines, ["DM:","DUR"]) || "");
      const varj = extractTimeRange(findLine(lines, ["V:","VARJ"]) || "");

      const yogaLine = lines.find(l => l.toLowerCase().includes("yoga")) || "";
      const karanaLine = lines.find(l => l.toLowerCase().includes("karana")) || "";

      // Build clean grid
      const items = [];

      if (sunrise) items.push(["Sunrise", "☼ " + sunrise]);
      if (sunset) items.push(["Sunset", sunset]);
      if (moonrise) items.push(["Moonrise", "☽ " + moonrise]);
      if (moonset) items.push(["Moonset", moonset]);

      if (pakshaLine) items.push(["Paksha / Month", pakshaLine]);
      if (tithiLine && tithiLine !== pakshaLine) items.push(["Tithi", tithiLine]);
      if (nakFallback) items.push(["Nakshatra", nakFallback]);

      if (rahu) items.push(["Rahu Kalam", rahu]);
      if (yama) items.push(["Yamagandam", yama]);
      if (dur) items.push(["Dur Muhurtam", dur]);
      if (varj) items.push(["Varjyam", varj]);

      if (yogaLine) items.push(["Yoga", yogaLine]);
      if (karanaLine) items.push(["Karana", karanaLine]);

      if (!items.length){
        pretty.innerHTML = '<div class="loading">Could not parse widget output. (We can adjust parsing once we see the raw text.)</div>';
        postHeight();
        return;
      }

      pretty.innerHTML =
        '<div class="grid">' +
          items.map(([k,v]) =>
            '<div class="item"><div class="label">'+k+'</div><div class="value">'+(v||"")+'</div></div>'
          ).join("") +
        '</div>';

      postHeight();
    }

    // Watch raw container after widget writes into it
    const raw = document.getElementById("raw");

    function tryParse(){
      const text = raw.innerText || raw.textContent || "";
      if (text.trim().length > 20) buildUI(text);
    }

    // Observe changes
    const obs = new MutationObserver(() => {
      tryParse();
    });
    obs.observe(raw, { childList:true, subtree:true, characterData:true });

    // Try repeatedly (widget renders async)
    let tries = 0;
    const timer = setInterval(() => {
      tryParse();
      postHeight();
      tries++;
      if (tries > 18) clearInterval(timer);
    }, 400);

    window.addEventListener("load", postHeight);
    window.addEventListener("resize", postHeight);
  </script>

  <!-- MyPanchang writes into #raw (hidden). We'll parse it and show our UI. -->
  <div id="mypanchang-feed-container"></div>
  <script>
    // Some widgets look for the target id in DOM; we point it to #raw
    document.getElementById("mypanchang-feed-container").id = "raw";
  </script>

  <script src="https://www.mypanchang.com/displaypanchang.js"
          data-target-id="raw"
          data-locid="${locid}">
  </script>
</body>
</html>`;
  }, [locid]);

  useEffect(() => {
    const onMsg = (e) => {
      if (e?.data?.type !== "MYPANCHANG_HEIGHT") return;
      const h = Number(e.data.height);
      if (Number.isFinite(h) && h > 150 && h < 2000) setHeight(h + 10);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <section className="py-10 px-4 relative z-30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-800">
            Today’s Panchangam
          </h3>
          <div className="h-1 w-16 rounded-full bg-orange-500 mt-2" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
        <div style={{ overflow: "hidden", borderRadius: "16px" }}>
        <iframe
        title="MyPanchangam"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-same-origin"
        className="w-full"
        style={{
        border: 0,
        height: "365px",      // ✅ increase height so no scroll is needed
        display: "block",
        overflow: "hidden",
        background: "transparent",
        }}
        />
    </div>
        </div>
      </div>
    </section>
  );
}