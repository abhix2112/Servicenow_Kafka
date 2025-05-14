const router = require("express").Router();
const db = require("../db/pool");

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM events) AS total_events,
        (SELECT COUNT(*) FROM events WHERE status='created') AS incidents_sent,
        (SELECT COUNT(*) FROM events WHERE status='deduped') AS duplicates_skipped,
        (SELECT COUNT(*) FROM events WHERE status='rate_limited') AS rate_limit_skips,
        (SELECT COUNT(*) FROM events WHERE status='failed') AS api_failures
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
