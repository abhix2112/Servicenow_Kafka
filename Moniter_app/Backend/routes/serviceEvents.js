const router = require("express").Router();
const db = require("../db/pool");

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT service, COUNT(*) AS count
      FROM events
      GROUP BY service
      ORDER BY count DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Service Events Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
