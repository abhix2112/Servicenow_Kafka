const router = require("express").Router();
const db = require("../db/pool");

// GET /events
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    const eventsQuery = await db.query(
      `
      SELECT id, service, source, status, created_at
      FROM events
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    const countQuery = await db.query(`SELECT COUNT(*) FROM events`);

    res.json({
      total: parseInt(countQuery.rows[0].count),
      page,
      limit,
      data: eventsQuery.rows,
    });
  } catch (err) {
    console.error("Events Fetch Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// POST /events
router.post("/", async (req, res) => {
  const { service, source, status, payload } = req.body;

  if (!service || !source || !status || !payload) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO events (service, source, status, payload)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [service, source, status, payload]
    );

    res.status(201).json({ message: "Event created", event: result.rows[0] });
  } catch (err) {
    console.error("Event Insert Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
