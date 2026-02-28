import React, { useMemo } from "react";

export default function BookingCalendar({
  calendarId,
  bookingLink,
  eyebrow = "Events",
  title = "Monthly Schedule",
  subtitle = "Booked Temple Events",
  timezone = "America/Indianapolis",
}) {
  const src = useMemo(() => {
    if (!calendarId) return "";
    const base = "https://calendar.google.com/calendar/embed";
    const params = new URLSearchParams({
      src: calendarId,               // will be encoded by URLSearchParams
      ctz: timezone,
      mode: "MONTH",
      showTitle: "0",
      showNav: "1",
      showDate: "1",
      showPrint: "0",
      showTabs: "0",
      showCalendars: "0",
      showTz: "0",
    });
    return `${base}?${params.toString()}`;
  }, [calendarId, timezone]);

  return (
    <div className="w-full bg-white/90 rounded-2xl shadow-lg p-6">
      <div className="mb-4">
        <div className="text-xs tracking-widest text-orange-600 font-semibold uppercase">
          {eyebrow}
        </div>
        <div className="text-3xl font-bold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
      </div>

      {!calendarId ? (
        <div className="p-4 rounded-lg bg-yellow-50 text-yellow-900 border border-yellow-200">
          Calendar ID missing. Set <b>VITE_GOOGLE_CALENDAR_ID</b> in your environment.
        </div>
      ) : (
        <>
          <div className="rounded-2xl overflow-hidden border">
            <iframe
              key={src} // forces refresh when src changes
              title="Temple Calendar"
              src={src}
              className="w-full h-[650px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {bookingLink ? (
            <div className="mt-4">
              <a
                href={bookingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700"
              >
                Book a Priest / Event
              </a>
            </div>
          ) : null}


        </>
      )}
    </div>
  );
}
