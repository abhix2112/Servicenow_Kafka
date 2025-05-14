const router = require("express").Router();
const db = require("../db/pool");

// GET /logs - fetch latest 50 logs
router.get("/", async (req, res) => {
  try {
    const logs = await db.query(`
      SELECT id, message, level, created_at
      FROM logs
      ORDER BY created_at DESC
      LIMIT 50
    `);
    res.json(logs.rows);
  } catch (err) {
    console.error("Logs Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// POST /logs - create a new log entry
router.post("/", async (req, res) => {
  const { message, level } = req.body;

  if (!message || !level) {
    return res.status(400).json({ error: "Missing 'message' or 'level'" });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO logs (message, level)
      VALUES ($1, $2)
      RETURNING *
    `,
      [message, level]
    );

    res.status(201).json({ message: "Log created", log: result.rows[0] });
  } catch (err) {
    console.error("Log Insert Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
