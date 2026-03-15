const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

/* ---------- SINGLE VENUE TEST ROUTE ---------- */
app.get("/test", async (req, res) => {
  try {
    const url =
      "https://api.playo.io/booking-lab-public/availability/v1/42d5c522-0948-48e4-b491-b1a6c0effd91/SP5/2026-03-16";

    const response = await axios.get(url, {
      headers: {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "origin": "https://playo.co",
        "referer": "https://playo.co/booking?venueId=42d5c522-0948-48e4-b491-b1a6c0effd91",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
      }
    });

    const courts = response.data.data.courtInfo;

    const result = courts.map(court => ({
      court: court.courtName.trim(),
      availableSlots: court.slotInfo
        .filter(slot => slot.status === 0)
        .map(slot => slot.time.substring(0, 5))
    }));

    res.json(result);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Fetch failed" });
  }
});

/* ---------- MANIKONDA AGGREGATED ROUTE ---------- */
app.get("/api/availability/manikonda", async (req, res) => {
  try {
    const date = req.query.date || "2026-03-16";

    const venues = [
      { name: "Nex Arena", id: "42d5c522-0948-48e4-b491-b1a6c0effd91" },
      { name: "Ira Sports Hub", id: "7f7ae818-d721-4ce3-a51e-d8ccd5fe24e7" },
      { name: "Match Point", id: "603f6f86-df41-4d3f-9d82-c27b9de96ca6" },
      { name: "Badminton Wings", id: "ec0271b5-818d-4a63-b239-074536ed75d6" },
      { name: "YV Academy", id: "3af96251-cd8c-481a-9e23-43617855c3e4" }
    ];

    const now = new Date();
    const nextHour =
      now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();

    function to12hr(t) {
      let h = parseInt(t.substring(0, 2));
      let m = t.substring(3, 5);
      const suffix = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return m === "00" ? `${h} ${suffix}` : `${h}:${m} ${suffix}`;
    }

    const results = [];

    for (const venue of venues) {
      const url = `https://api.playo.io/booking-lab-public/availability/v1/${venue.id}/SP5/${date}`;

      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
          origin: "https://playo.co",
          referer: `https://playo.co/booking?venueId=${venue.id}`,
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });

      const courtInfo = response.data.data.courtInfo;

      const courts = courtInfo
        .map(court => {
          const slots = court.slotInfo
            .filter(s => {
              const hour = parseInt(s.time.substring(0, 2));
              return s.status === 1;
            })
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(s => to12hr(s.time));
          

          if (slots.length === 0) return null;

          return {
            court: court.courtName.trim(),
            slots
          };
        })
        .filter(Boolean);

      const price =
        courtInfo[0]?.slotInfo?.find(s => s.price)?.price || null;

      results.push({
        venue: venue.name,
        pricePerHour: price,
        courts
      });
    }

    res.json(results);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Aggregation failed" });
  }
});

/* ---------- SERVER START ---------- */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});