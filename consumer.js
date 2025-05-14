const kafka = require("kafka-node");
const redis = require("redis");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(
  client,
  [{ topic: "incident-events", partition: 0 }],
  { autoCommit: true }
);

// Connect to Redis
const redisClient = redis.createClient({ url: "redis://localhost:6379" });
redisClient.connect();

consumer.on("message", async (message) => {
  const event = JSON.parse(message.value);
  const signature = crypto
    .createHash("sha256")
    .update(JSON.stringify(event))
    .digest("hex");

  const alreadyProcessed = await redisClient.get(signature);
  if (alreadyProcessed) {
    console.log("🔁 Duplicate event ignored:", event.error);
    return;
  }

  await redisClient.set(signature, "1", { EX: 120 });
  redisClient.publish("new_event", JSON.stringify(event));
  try {
    const response = await axios.post(
      `${process.env.SN_INSTANCE}/api/now/table/incident`,
      {
        short_description: `[${event.severity}] ${event.service} failure: ${event.error}`,
        description: `Service: ${event.service}\nSeverity: ${event.severity}\nError: ${event.error}\nTimestamp: ${event.timestamp}`,
        urgency: event.severity === "high" ? "1" : "2",
      },
      {
        auth: {
          username: process.env.SN_USERNAME,
          password: process.env.SN_PASSWORD,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(
      "🚨 Incident Created in ServiceNow: ",
      response.data.result.number
    );
  } catch (err) {
    console.error(
      "❌ Failed to create incident:",
      err.response?.data || err.message
    );
  }
});
