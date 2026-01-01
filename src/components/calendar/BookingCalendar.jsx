import { useMemo, useState } from "react";

const views = [
  { label: "Month", value: "MONTH" },
  { label: "Week", value: "WEEK" },
  { label: "Schedule", value: "AGENDA" },
];

const resolveTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
};

export default function BookingCalendar({
  calendarId,
  bookingLink,
  eyebrow,
  title,
  subtitle,
}) {
  const [view, setView] = useState("MONTH");
  const timezone = useMemo(() => resolveTimeZone(), []);

  const iframeSrc = useMemo(() => {
    if (!calendarId) return "";
    const params = new URLSearchParams({
      src: calendarId,
      ctz: timezone,
      mode: view,
      showTitle: "0",
      showTabs: "0",
      showCalendars: "0",
      showPrint: "0",
      showDate: "1",
      wkst: "1",
      bgColor: "#ffffff",
      height: "720",
    });
    console.log(params, 'tfugyhji');
    return `https://calendar.google.com/calendar/embed?${params.toString()}`;
  }, [calendarId, timezone, view]);

  if (!calendarId) {
    return (
      <section className="calendar-page">
        <div className="calendar-card">
          <header className="calendar-header">
            <div>
              <p className="eyebrow">Google Calendar</p>
              <h1>Calendar unavailable</h1>
              <p className="subtext">
                Provide a valid VITE_CALENDAR_ID value in your environment file to load events.
              </p>
            </div>
          </header>
        </div>
      </section>
    );
  }

  return (
    <section className="calendar-page w-full">
      <div className="calendar-card">
        <header className="calendar-header">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="subtext">{subtitle}</p>
          </div>

          <div className="calendar-actions">
            <select
              aria-label="Calendar view"
              className="view-select"
              value={view}
              onChange={(event) => setView(event.target.value)}
            >
              {views.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {bookingLink && (
              <a
                className="primary-btn"
                href={bookingLink}
                target="_blank"
                rel="noreferrer"
              >
                Book slot
              </a>
            )}
          </div>
        </header>

        <div className="iframe-shell">
          {iframeSrc ? (
            <iframe
              title="Google Calendar"
              src={iframeSrc}
              className="calendar-iframe"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            <p className="calendar-helper">Unable to render Google Calendar embed.</p>
          )}
        </div>
      </div>
    </section>
  );
}
