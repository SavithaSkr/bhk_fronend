export default function CalendarMini({
  calendarId,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  height = 500,
  width = "100%",
}) {
  const src = `https://calendar.google.com/calendar/embed?showTitle=0&showPrint=0&showTabs=0&showCalendars=0&mode=AGENDA&height=${height}&wkst=1&bgcolor=%23ffffff&src=${calendarId}&ctz=${timezone}`;
  return (
    <iframe
      src={src}
      style={{
        border: 0,
        width: typeof width === "number" ? `${width}px` : width,
        height: `${height}px`,
        borderRadius: "12px",
      }}
      frameBorder="0"
      scrolling="yes"
    ></iframe>
  );
}
