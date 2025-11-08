import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  ChevronDown,
  Star,
  Sun,
  Moon,
  Clock,
  Sparkles,
} from "lucide-react";
// Assuming you will copy Button, Card, CardContent to your components/ui folder if needed
import { Panchangam } from "../../services/entities.js"; // Updated import path

export default function CompactPanchangamBar() {
  const [panchangamData, setPanchangamData] = useState(null);
  const [auspiciousDays, setAuspiciousDays] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    loadData();
    // Refresh data every 4 hours
    const interval = setInterval(loadData, 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const response = await Panchangam.fetchPanchangamData(); // Updated API call
      if (response.success) {
        setPanchangamData(response.panchangam);
        setAuspiciousDays(response.auspiciousDays || []);
      }
    } catch (err) {
      console.error("Error loading panchangam data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-orange-50 text-slate-600 py-1 border-b">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 py-1">
            <Calendar className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Loading Panchangam...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!panchangamData) return null;

  const todaysSpecialDay = auspiciousDays.find((day) => day.isToday);
  const upcomingDays = auspiciousDays.filter((day) => day.isSoon);

  return (
    <div className="bg-orange-500 text-slate-700 shadow-sm relative z-40 border-b border-slate-200 navbar-header">
      {/* Compact Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white" />
              <span className="font-semibold text-sm text-white">
                {panchangamData.formattedDate}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-sm text-white">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-white" />
                <span>Tithi: {panchangamData.tithi}</span>
              </div>
              <div className="flex items-center gap-1">
                <Moon className="w-3 h-3 text-white" />
                <span>Nakshatra: {panchangamData.nakshatra}</span>
              </div>

              {todaysSpecialDay && (
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  🎉 Today: {todaysSpecialDay.name}
                </div>
              )}

              {upcomingDays.length > 0 && !todaysSpecialDay && (
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                  ⭐ {upcomingDays[0].name} in {upcomingDays[0].daysLeft} days
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
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

        {/* Mobile Compact View */}
        <div className="md:hidden mt-2 text-xs text-center ">
          {todaysSpecialDay ? (
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold animate-pulse">
              🎉 Today: {todaysSpecialDay.name}
            </div>
          ) : (
            upcomingDays.length > 0 && (
              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                ⭐ {upcomingDays[0].name} in {upcomingDays[0].daysLeft} days
              </div>
            )
          )}
        </div>
      </div>

      {/* Expanded Content (smooth) */}
      <div
        style={{
          maxHeight: isExpanded
            ? (contentRef.current?.scrollHeight || 0) + "px"
            : "0px",
          opacity: isExpanded ? 1 : 0,
          transition: "max-height 300ms ease, opacity 300ms ease",
          overflow: "hidden",
        }}
        className="bg-orange-100/50 backdrop-blur-sm border-t border-slate-200"
      >
        <div ref={contentRef} className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Panchangam Details */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-800">
                <Sun className="w-4 h-4 text-orange-500" />
                Today's Panchangam
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/80 p-2 rounded">
                  <div className="font-medium text-orange-600">Tithi</div>
                  <div className="text-slate-700">{panchangamData.tithi}</div>
                </div>
                <div className="bg-white/80 p-2 rounded">
                  <div className="font-medium text-orange-600">Nakshatra</div>
                  <div className="text-slate-700">
                    {panchangamData.nakshatra}
                  </div>
                </div>
                <div className="bg-white/80 p-2 rounded">
                  <div className="font-medium text-orange-600">Yoga</div>
                  <div className="text-slate-700">{panchangamData.yoga}</div>
                </div>
                <div className="bg-white/80 p-2 rounded">
                  <div className="font-medium text-orange-600">Karana</div>
                  <div className="text-slate-700">{panchangamData.karana}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Sun: {panchangamData.sunrise} - {panchangamData.sunset}
              </div>
            </div>

            {/* Auspicious Days */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-800">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Upcoming Auspicious Days
              </h3>
              <div className="space-y-2">
                {auspiciousDays.slice(0, 4).map((day, index) => (
                  <div
                    key={index}
                    className="bg-white/80 p-2 rounded text-sm flex justify-between items-center"
                  >
                    <span className="font-medium text-slate-800">
                      {day.name}
                    </span>
                    <div className="text-right">
                      {day.isToday ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                          Today!
                        </span>
                      ) : (
                        <div>
                          <div className="text-orange-600 font-semibold">
                            {day.daysLeft === 1
                              ? "Tomorrow"
                              : `${day.daysLeft} days`}
                          </div>
                          <div className="text-xs text-slate-500">
                            {day.date}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
