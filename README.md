---

# Saathi – Distributed Coding Platform


<p align="center">
  <img width="690" height="600" alt="Screenshot 2025-07-18 at 7 25 20 AM" src="https://github.com/user-attachments/assets/32cf2e3b-fccf-40eb-b552-a98a0ce66a72" />
</p>


#
Saathi is a production-grade, microservice-oriented platform engineered to facilitate competitive programming (CP) and technical interview preparation. The system is architected to handle high-concurrency code execution while simultaneously providing deep, insight-heavy analytics through a decoupled, asynchronous processing model.

## Project Overview

Saathi addresses the inherent challenges of online judge systems: balancing the intensive CPU demands of code compilation and execution with the data-intensive nature of performance analytics. By segregating the system into two distinct operational pipelines—the **Dual Practice Pipeline** and the **Analytics & Review Pipeline**—Saathi ensures that compute-heavy workloads do not interfere with the responsiveness of the user-facing analytical services.

## Core Design Philosophy

The architecture is governed by three primary principles:

* **Isolation of Concerns:** Code execution is strictly sandboxed and isolated from the primary application logic to ensure security and resource stability.
* **Workload-Specific Optimization:** The system utilizes different communication protocols (gRPC vs. REST) and persistence layers (SQL vs. NoSQL) based on the specific needs of the workload.
* **Asynchronous Resilience:** Long-running execution tasks are handled via message queues to prevent blocking the request-response cycle of the API Gateway.

---
### High-Level Architecture Explanation

The Saathi architecture utilizes a centralized **API Gateway** as the single ingress point for all client traffic. Upon receiving a request, the gateway routes the traffic into one of two specialized pipelines:

1. **Dual Practice Pipeline:** Manages the lifecycle of code submission, evaluation against test cases, and result reporting.
2. **Analytics & Review Pipeline:** Manages persistent storage of submission history, AI-powered code reviews, and user growth metrics.

---

## ✨ Key Features

* **🤖 AI Concept Tagging:** Automatically identifies if mistakes are related to specific domains such as `Promises`, `CSS Grid`, `Logic`, or `Security`.
* **📝 Structured Feedback:** Delivers mentor-style explanations, optimized solutions, and curated learning links based on execution results.
* **📊 Personalized Analytics:** A specialized dashboard that tracks progress and identifies "Top Struggle Areas" using historical submission data.
* **🔐 Mistake Vault:** Every review is persisted to a private history, enabling longitudinal tracking of user improvement.

---

## 🛠️ Tech Stack

* **AI Engine:** Gemini 2.0 Flash (Google Generative AI)
* **Backend:** Node.js & Express (ES Modules)
* **Database:** MongoDB & Mongoose (Read-optimized for Analytics)
* **Execution Environment:** Docker Containerization
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt

---

## Workload Breakdown

### Workload 1: Code Execution Service (Dual Practice Pipeline)

* **Async Task Queue:** Decouples submission from evaluation, protecting the system from traffic spikes.
* **Sandboxed Docker Execution:** Each submission runs in a hardened, ephemeral container with strict CPU/Memory quotas and no egress network access.
* **gRPC Return Path:** Low-latency, strongly typed communication for immediate execution status delivery to the Gateway.

### Workload 2: Code Review & Analytics (Insight Pipeline)

* **MongoDB Persistence:** Chosen for its schema flexibility to store varied AI-generated feedback and metadata.
* **Grok/Gemini Review Service:** Performs static and dynamic analysis to provide time complexity and logic optimization insights.
* **Centralized Response Handling:** The API Gateway aggregates data from both workloads to provide a unified user response.

---

## 🚀 Getting Started

### 1. Prerequisites

* Node.js (v18+)
* MongoDB (Local or Atlas)
* Gemini API Key ([Get it here](https://aistudio.google.com/))

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/saathi-backend.git

# Navigate into the project
cd saathi-backend

# Install dependencies
npm install

```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_api_key
JWT_SECRET=your_secure_secret

```

### 4. Execution

```bash
# Development mode (with Nodemon)
npm run dev

# Production mode
npm start

```

---

## Scalability, Security, and Extensibility

* **Scalability:** The Code Execution Service supports independent horizontal scaling. During peak contest load, the worker pool can be expanded without impacting the Analytics API.
* **Security:** Runtime security is enforced via restricted system calls (Seccomp) and resource limits within the Docker sandbox.
* **Extensibility:** The modular gRPC interface allows for the addition of new evaluation engines (e.g., specialized ML model evaluators) with minimal changes to the core gateway.

---
