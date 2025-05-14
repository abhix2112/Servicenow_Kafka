# 🚨 Real-Time Incident Streaming to ServiceNow

> ⚡ Stream microservice failures directly into ServiceNow in real time using Kafka, Node, Redis, WebSockets, and GraphQL.

---

## 📌 Project Overview

This project demonstrates a real-time pipeline that ingests error logs or alerts from microservices and instantly creates ServiceNow incidents — with sub-second latency.

Built for modern DevOps/SRE use cases, this system simulates a high-scale enterprise setup capable of processing **thousands of events per second** with **automated incident management** and **live system visibility**.

---

## 🎯 Objective

- Ingest microservice error logs using Apache Kafka.
- Process and filter logs in real-time using Node.js.
- Create ServiceNow incidents instantly via REST API.
- Push real-time incident updates to a WebSocket-powered dashboard.
- Expose a GraphQL API for querying incident data efficiently.

---

## 💡 Real-World Use Case (Swiggy-style Example)

### 🛠 Scenario:
Imagine you're an engineer at **Swiggy** or **Flipkart**. You run hundreds of microservices:
- 🛒 Order Service  
- 💳 Payment Service  
- 📦 Delivery Tracking  
- 📡 Notification Service  

During peak hours (7–7:15 PM), the **Payment Service crashes**. 1,000 users can’t complete payments.

---

### ❌ Without this pipeline:
- Logs go to tools like Datadog or CloudWatch.
- DevOps checks email or Slack manually.
- They create a ServiceNow ticket **5–10 minutes later**.
- NOC or SRE sees it **after SLA breach**.
- Angry customers, revenue loss.

---

### ✅ With this system:
- 💥 Payment Service emits a Kafka error event *instantly*.
- ⚙️ Real-time processor picks it up in **milliseconds**.
- 📄 Auto-creates a ServiceNow incident with full details.
- 📊 Dashboard shows it *live* via WebSocket within **1 second**.
- 🧠 SRE starts mitigation **before impact grows**.

---

### 🧠 Business Impact:
- 🚀 Faster MTTR (Mean Time To Resolve)
- 🤖 Zero manual effort = fewer delays
- 📡 Real-time dashboard = 24/7 transparency
- 💼 Better SLAs, happy customers, higher reliability

---

## 🛠️ Tech Stack

| Component      | Technology               | Purpose                            |
|----------------|--------------------------|------------------------------------|
| Event Bus      | Apache Kafka             | Stream real-time logs              |
| Processor      | Node.js                  | Consume + filter + push incidents  |
| Incident Store | Redis (optional)         | Fast access to recent data         |
| UI             | React + WebSockets       | Live incident dashboard            |
| API Layer      | GraphQL (Apollo/Hasura)  | Query incident history, filters    |
| ITSM           | ServiceNow               | Auto incident creation via REST    |
| DB (optional)  | PostgreSQL / MongoDB     | Logs / incident metadata storage   |

---

## 🧪 Example Simulation Flow

```bash
# 1. Simulate 1,000 error events from a microservice
$ node producer.js

# 2. Kafka receives and queues the events
# 3. consumer.js picks them up in real-time
# 4. For each critical event:
#    → ServiceNow REST API is called
#    → Incident created in under 1 second
#    → WebSocket broadcasts to UI
#    → Saved to Redis or DB (optional)
```
📸 Screenshot

Live incident dashboard showing real-time spikes in alerts.

🧰 Getting Started
```bash

# Clone the repo
git clone https://github.com/abhix2112/Servicenow_Kafka

# Set up environment
cp example.env .env

# Set up Backend and Frontend
npm install

# Run containers (Kafka, Redis, etc.)
docker-compose up

# Start producer
node producer.js

# Start consumer (Node)
node consumer.js

#Start Backed
npm index.js

#Start Frontend
npm run dev
```

📩 ServiceNow Integration
```
We use ServiceNow's Inbound REST API to create incidents programmatically. You’ll need:

* An active developer instance
* Basic Auth credentials

You can modify createIncident() in consumer.js to map real fields from your ServiceNow table.
```
🚀 Future Improvements
```
Add auth & logging to GraphQL APIs

Rust-native Redis and Kafka handling

Alert prioritization & deduplication logic

Retry mechanism for failed incidents
```

🙌 Credits
```
Built by Abhishek — backend & ServiceNow developer passionate about real-time systems, automation, and observability
```




