import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-deep:   #0a1f0e;
    --green-dark:   #102a14;
    --green-mid:    #1a4d22;
    --green-bright: #2ecc5a;
    --yellow:       #d4ff00;
    --yellow-soft:  #eeff66;
    --yellow-glow:  rgba(212,255,0,0.18);
    --white:        #f4fff6;
    --grey:         #8aab8f;
    --card-bg:      #111f13;
    --card-border:  #1e3d22;
  }

  html, body, #root {
    height: 100%;
    background: var(--green-deep);
  }

  .app {
    font-family: 'DM Sans', sans-serif;
    background: var(--green-deep);
    min-height: 100vh;
    color: var(--white);
    overflow-x: hidden;
    position: relative;
  }

  /* Subtle background mesh */
  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 10% 0%, rgba(46,204,90,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 90% 100%, rgba(212,255,0,0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .content {
    position: relative;
    z-index: 1;
    max-width: 680px;
    margin: 0 auto;
    padding: 0 16px 60px;
  }

  /* ── HEADER ── */
  .header {
    padding: 28px 0 24px;
    display: flex;
    align-items: flex-end;
    gap: 14px;
    border-bottom: 1px solid var(--card-border);
    margin-bottom: 28px;
  }

  .logo-icon {
    width: 44px;
    height: 44px;
    background: var(--yellow);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
    box-shadow: 0 0 20px rgba(212,255,0,0.35);
  }

  .logo-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(36px, 10vw, 52px);
    letter-spacing: 2px;
    color: var(--white);
    line-height: 1;
  }

  .logo-text span {
    color: var(--yellow);
  }

  .header-sub {
    margin-left: auto;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--grey);
    text-align: right;
    line-height: 1.5;
    padding-bottom: 4px;
  }

  .live-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: var(--green-bright);
    border-radius: 50%;
    margin-right: 5px;
    animation: pulse 1.4s ease-in-out infinite;
    vertical-align: middle;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }

  /* ── DATE TABS ── */
  .date-strip {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .date-btn {
    flex: 1;
    padding: 12px 0;
    background: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: 12px;
    color: var(--grey);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.4px;
  }

  .date-btn:hover {
    border-color: var(--green-bright);
    color: var(--white);
  }

  .date-btn.active {
    background: var(--yellow);
    border-color: var(--yellow);
    color: var(--green-deep);
    box-shadow: 0 0 18px rgba(212,255,0,0.3);
  }

  /* ── UPCOMING TOGGLE ── */
  .toggle-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }

  .toggle-label {
    font-size: 13px;
    color: var(--grey);
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .toggle-track {
    width: 42px;
    height: 24px;
    background: var(--card-border);
    border-radius: 999px;
    position: relative;
    cursor: pointer;
    transition: background 0.25s;
    flex-shrink: 0;
    border: 1.5px solid var(--card-border);
  }

  .toggle-track.on {
    background: var(--green-bright);
    border-color: var(--green-bright);
    box-shadow: 0 0 12px rgba(46,204,90,0.4);
  }

  .toggle-track.disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background: var(--white);
    border-radius: 50%;
    transition: transform 0.25s;
  }

  .toggle-track.on .toggle-thumb {
    transform: translateX(18px);
  }

  /* ── DATE DISPLAY ── */
  .date-display {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--green-bright);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  /* ── LOADING ── */
  .loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 0;
    gap: 14px;
    color: var(--grey);
    font-size: 13px;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--card-border);
    border-top-color: var(--yellow);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── VENUE CARD ── */
  .venue-card {
    background: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: 18px;
    margin-bottom: 18px;
    overflow: hidden;
    transition: border-color 0.2s;
  }

  .venue-card:hover {
    border-color: var(--green-mid);
  }

  .venue-header {
    padding: 20px 20px 14px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    border-bottom: 1px solid var(--card-border);
  }

  .venue-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(20px, 5vw, 26px);
    letter-spacing: 1px;
    color: var(--white);
    line-height: 1.1;
  }

  .price-badge {
    background: var(--yellow-glow);
    border: 1px solid rgba(212,255,0,0.3);
    color: var(--yellow);
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── COURT ── */
  .court-block {
    padding: 14px 20px;
    border-bottom: 1px solid var(--card-border);
  }

  .court-block:last-child {
    border-bottom: none;
  }

  .court-name {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--green-bright);
    margin-bottom: 10px;
    font-family: 'Space Mono', monospace;
  }

  .slots-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  /* ── SLOT CHIP ── */
  .slot-chip {
    padding: 7px 13px;
    border-radius: 999px;
    font-size: 12px;
    font-family: 'Space Mono', monospace;
    font-weight: 400;
    background: rgba(46,204,90,0.08);
    border: 1.5px solid rgba(46,204,90,0.22);
    color: var(--white);
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
    letter-spacing: 0.3px;
  }

  .slot-chip:hover {
    background: var(--yellow);
    border-color: var(--yellow);
    color: var(--green-deep);
    box-shadow: 0 0 14px rgba(212,255,0,0.4);
    transform: translateY(-1px) scale(1.04);
  }

  .slot-chip:active {
    transform: scale(0.97);
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center;
    padding: 50px 20px;
    color: var(--grey);
  }

  .empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    color: var(--white);
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .empty-sub {
    font-size: 13px;
    line-height: 1.6;
  }

  .no-slots {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--grey);
    padding: 4px 0;
    letter-spacing: 0.5px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 400px) {
    .header { padding: 20px 0 18px; }
    .header-sub { display: none; }
    .slot-chip { font-size: 11px; padding: 6px 11px; }
  }
`;

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

  function formatDateLabel(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
  }

  useEffect(() => {
    const date = getDate(dateOffset);
    setLoading(true);
    fetch(`http://localhost:5000/api/availability/manikonda?date=${date}`)
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
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
  const nextHour = now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();

  const totalSlots = data.reduce((acc, v) =>
    acc + v.courts.reduce((a, c) =>
      a + c.slots.filter(s => !upcomingOnly || dateOffset !== 0 || slotHour(s) >= nextHour).length, 0), 0);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="content">

          {/* HEADER */}
          <div className="header">
            <div className="logo-icon">🏸</div>
            <div className="logo-text">Live<span>Court</span></div>
            <div className="header-sub">
              <span className="live-dot" />LIVE<br />
              Manikonda
            </div>
          </div>

          {/* DATE TABS */}
          <div className="date-strip">
            <button
              className={`date-btn ${dateOffset === 0 ? "active" : ""}`}
              onClick={() => { setDateOffset(0); setUpcomingOnly(true); }}
            >Today</button>
            <button
              className={`date-btn ${dateOffset === 1 ? "active" : ""}`}
              onClick={() => { setDateOffset(1); setUpcomingOnly(false); }}
            >Tomorrow</button>
          </div>

          {/* UPCOMING TOGGLE */}
          <div className="toggle-row">
            <div
              className={`toggle-track ${upcomingOnly && dateOffset === 0 ? "on" : ""} ${dateOffset === 1 ? "disabled" : ""}`}
              onClick={() => dateOffset === 0 && setUpcomingOnly(v => !v)}
            >
              <div className="toggle-thumb" />
            </div>
            <span className="toggle-label">Upcoming slots only</span>
          </div>

          {/* DATE DISPLAY */}
          <div className="date-display">
            📅 {formatDateLabel(dateOffset)}
            {!loading && totalSlots > 0 && ` · ${totalSlots} slot${totalSlots !== 1 ? "s" : ""} available`}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="loading-wrap">
              <div className="spinner" />
              <span>Fetching courts…</span>
            </div>
          )}

          {/* VENUES */}
          {!loading && data.map(venue => {
            const venueSlots = venue.courts.reduce((a, c) =>
              a + c.slots.filter(s => !upcomingOnly || dateOffset !== 0 || slotHour(s) >= nextHour).length, 0);

            return (
              <div key={venue.venue} className="venue-card">
                <div className="venue-header">
                  <div className="venue-name">{venue.venue}</div>
                  <div className="price-badge">₹{venue.pricePerHour}/hr</div>
                </div>

                {venue.courts.map(court => {
                  const filteredSlots = court.slots.filter(slot =>
                    !upcomingOnly || dateOffset !== 0 || slotHour(slot) >= nextHour
                  );

                  return (
                    <div key={court.court} className="court-block">
                      <div className="court-name">{court.court}</div>
                      <div className="slots-wrap">
                        {filteredSlots.length === 0
                          ? <div className="no-slots">No slots available</div>
                          : filteredSlots.map(slot => (
                            <div key={slot} className="slot-chip">{slot}</div>
                          ))
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* EMPTY STATE */}
          {!loading && data.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏸</div>
              <div className="empty-title">No Courts Found</div>
              <div className="empty-sub">Check back soon or try a different date.</div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default App;
