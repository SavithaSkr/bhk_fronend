import React, { useState, useEffect } from "react";
import { Calendar, Clock, Sun, Moon, Star } from "lucide-react";
import { Panchangam } from "../../services/entities.js"; // Updated import path

export default function PanchangamBar() {
  const [panchangamData, setPanchangamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPanchangamData();
    const interval = setInterval(loadPanchangamData, 60 * 60 * 1000); // Refresh every hour
    return () => clearInterval(interval);
  }, []);

  const loadPanchangamData = async () => {
    try {
      setLoading(true);
      const response = await Panchangam.fetchPanchangamData();
      setPanchangamData(response);
      if (!response.success) {
        setError(response.error || "Using calculated data");
      } else {
        setError(null);
      }
    } catch (err) {
      setError("Failed to load Panchangam data");
      console.error("Error loading panchangam:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading Today's Panchangam...</span>
          </div>
        </div>
      </div>
    );
  }

  // Only show error if no data is available at all
  if (!panchangamData || !panchangamData.panchangam) {
    return (
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-sm">
            Panchangam data temporarily unavailable
          </span>
        </div>
      </div>
    );
  }

  const { panchangam } = panchangamData;

  return (
    <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white py-3 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {/* Date and Tithi */}
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            <div className="text-center">
              <div className="font-semibold">Today's Tithi</div>
              <div className="text-yellow-200">{panchangam.tithi}</div>
            </div>
          </div>

          {/* Nakshatra */}
          <div className="flex items-center justify-center gap-2">
            <Star className="w-4 h-4" />
            <div className="text-center">
              <div className="font-semibold">Nakshatra</div>
              <div className="text-yellow-200">{panchangam.nakshatra}</div>
            </div>
          </div>

          {/* Sunrise/Sunset */}
          <div className="flex items-center justify-center gap-2">
            <Sun className="w-4 h-4" />
            <div className="text-center">
              <div className="font-semibold">Sun Times</div>
              <div className="text-yellow-200">
                {panchangam.sunrise} - {panchangam.sunset}
              </div>
            </div>
          </div>

          {/* Yoga */}
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <div className="text-center">
              <div className="font-semibold">Yoga</div>
              <div className="text-yellow-200">{panchangam.yoga}</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-2 text-xs text-yellow-100">
          Last updated:{" "}
          {new Date(panchangamData.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
