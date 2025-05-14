const kafka = require("kafka-node");
const axios = require("axios");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka.Producer(client);

producer.on("ready", async () => {
  console.log("Kafka Producer is ready");

  const kafkaPayload = [
    {
      topic: "incident-events",
      messages: JSON.stringify({
        service: "payments",
        severity: "high",
        error: "Payment gateway timeout",
        timestamp: new Date().toISOString(),
      }),
    },
  ];

  // Send Kafka message
  producer.send(kafkaPayload, (err, data) => {
    if (err) console.error("Kafka Send failed:", err);
    else console.log("Kafka message sent:", data);
  });

  // Send event to backend
  await emitEvent();

  // Send log to backend
  await sendLog();
});

producer.on("error", (err) => {
  console.error("Kafka Producer error:", err);
});

// Send Event to /events
async function emitEvent() {
  try {
    const response = await axios.post("http://localhost:3000/events", {
      service: "user-service",
      source: "signup-page",
      status: "created",
      payload: {
        user_id: "u123",
        event_type: "signup",
      },
    });

    console.log("Event sent:", response.data);
  } catch (error) {
    console.error("Failed to send event:", error.message);
  }
}

// Send Log to /logs
async function sendLog() {
  try {
    const response = await axios.post("http://localhost:3000/logs", {
      service: "user-service",
      level: "info",
      message: "New user signup event created",
      timestamp: new Date().toISOString(),
    });

    console.log("Log sent:", response.data);
  } catch (error) {
    console.error("Failed to send log:", error.message);
  }
}
