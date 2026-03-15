import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateOffset, setDateOffset] = useState(0);
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  function getDate(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
  }

  useEffect(() => {
    const date = getDate(dateOffset);

    setLoading(true);

    fetch(
      `http://localhost:5000/api/availability/manikonda?date=${date}`
    )
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dateOffset]);

  function slotHour(slot) {
    let temp = slot.replace(" AM", "").replace(" PM", "");
    let hour = parseInt(temp);

    if (slot.includes("PM") && hour !== 12) hour += 12;
    if (slot.includes("AM") && hour === 12) hour = 0;

    return hour;
  }

  const now = new Date();
  const nextHour =
    now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();

  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        background: "#f0fff4",
        minHeight: "100vh",
        padding: 20
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(90deg,#c8f7c5,#fff59d)",
          padding: "18px 24px",
          fontSize: 28,
          fontWeight: 700,
          color: "#1b1b1b",
          marginBottom: 20
        }}
      >
        LiveCourt
      </div>

      {/* CONTROLS */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
  <button
    onClick={() => setDateOffset(0)}
    style={{
      padding: "8px 14px",
      background: dateOffset === 0 ? "#fff176" : "#eee",
      border: "none",
      borderRadius: 6,
      cursor: "pointer"
    }}
  >
    Today
  </button>

  <button
  onClick={() => {
    setDateOffset(1);
    setUpcomingOnly(false);
  }}
  style={{
    padding: "8px 14px",
    background: dateOffset === 1 ? "#fff176" : "#eee",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  }}
>
  Tomorrow
</button>

  <button
  disabled={dateOffset === 1}
  onClick={() => setUpcomingOnly(!upcomingOnly)}
  style={{
    padding: "8px 14px",
    background:
      dateOffset === 1
        ? "#ddd"
        : upcomingOnly
        ? "#c8f7c5"
        : "#eee",
    border: "none",
    borderRadius: 6,
    cursor: dateOffset === 1 ? "not-allowed" : "pointer",
    opacity: dateOffset === 1 ? 0.6 : 1
  }}
>
  Upcoming Only
</button>
</div>

      {loading && <div style={{ marginBottom: 20 }}>Loading slots…</div>}

      {/* VENUES */}
      {data.map(venue => (
        <div
          key={venue.venue}
          style={{
            background: "#fff",
            padding: 20,
            marginBottom: 16,
            borderRadius: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 6
            }}
          >
            {venue.venue}
          </div>

          <div style={{ marginBottom: 12, color: "#666" }}>
            ₹{venue.pricePerHour} / hr
          </div>

          {venue.courts.map(court => (
            <div key={court.court} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600 }}>{court.court}</div>

              <div>
                {court.slots
                  .filter(slot => {
                    if (!upcomingOnly) return true;
                    return slotHour(slot) >= nextHour;
                  })
                  .map(slot => (
                    <span
                      key={slot}
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        margin: "4px 6px 4px 0",
                        background: "#e8f5e9",
                        borderRadius: 8,
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "all 0.25s"
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = "#fff176";
                        e.target.style.boxShadow =
                          "0 0 8px rgba(255,235,59,0.9)";
                        e.target.style.transform = "scale(1.08)";
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = "#e8f5e9";
                        e.target.style.boxShadow = "none";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      {slot}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
