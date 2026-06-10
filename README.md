
# MarketBridge – AI-Driven Marketing Campaign Planner

**MarketBridge** is an intelligent multi-agent platform that automates marketing campaign planning by connecting marketing, finance, and inventory teams through autonomous AI agents.

The system uses **Retrieval-Augmented Generation (RAG)** to access CRM, finance, and inventory data in real time, allowing businesses to plan, optimize, and adapt campaigns more efficiently.

---

## Overview

Marketing campaign planning typically requires coordination between multiple departments:

* **Marketing:** Responsible for creative ideas and targeting customer segments.
* **Finance:** Ensures financial feasibility, budget control, and ROI.
* **Inventory:** Confirms product availability and supply chain readiness.

**MarketBridge** simplifies this process by using AI agents that collaborate and negotiate automatically to produce data-driven campaign plans.

---

## Features

* **Multi-Agent Collaboration**
  The system includes:

  * *Creative Agent* – Generates campaign ideas, creatives, and customer segments.
  * *Finance Agent* – Evaluates financial feasibility, budgets, and profitability.
  * *Inventory Agent* – Monitors product availability and distribution readiness.

* **Adaptive Planning**
  Campaigns automatically adjust when inventory levels or budgets change.

* **RAG-Enabled Intelligence**
  Integrates real-time CRM, finance, and inventory data to make informed decisions.

* **What-If Simulation**
  Allows users to test scenarios such as discount variations or budget changes.

* **Modern UI/UX**
  A clean, minimal interface design style.

* **Interactive Dashboards**
  Displays agent interactions, campaign projections, and overall performance.

---

## Tech Stack

| Layer         | Technologies                                |
| ------------- | ------------------------------------------- |
| Frontend      | React 18, Vite, Framer Motion               |
| Backend       | Python 3, Flask or FastAPI                  |
| AI / LLM      | Google Generative AI (Gemini API)           |
| Data Handling | Retrieval-Augmented Generation (RAG)        |
| Deployment    | Vercel, Render, or Railway (optional)       |

---

## Installation and Setup

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sanjayKumarR-404/NH-SJC25HACK-GENAI-013_Hackaholic.git
   cd MarketBridge/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**

---

### Backend Setup

1. Move to the backend directory and create a virtual environment:

   ```bash
   cd ..
   /backend
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend server:

   ```bash
   python main.py
   ```

4. The backend will run on **[http://localhost:5000](http://localhost:5000)**

---

### Environment Variables

Create `.env` files in both the frontend and backend directories.

**Frontend `.env`**

```
VITE_API_URL=http://localhost:5000
```

**Backend `.env`**

```
GOOGLE_API_KEY=your_google_generative_ai_key
```

---

## Folder Structure

```
MarketBridge/
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Pages such as Home, Dashboard
│   │   ├── styles/         # Global CSS 
│   │   ├── App.jsx         # Main app routes
│   │   └── main.jsx        # Vite entry file
│   └── package.json
│
├── backend/
│   ├── agents/             # Creative, Finance, and Inventory agents
│   ├── agent_manager.py    # Orchestrates agent collaboration
│   ├── main.py             # Backend entry point
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

---

## Agent Workflow

1. The **Creative Agent** proposes marketing ideas, content, and segments.
2. The **Finance Agent** validates these plans based on budget and ROI.
3. The **Inventory Agent** checks stock levels and supply constraints.
4. Agents collaborate and negotiate to finalize a feasible, optimized campaign plan.
5. The resulting plan is displayed to the user along with supporting data and visualizations.

---

## UI and UX Highlights

* Clean, minimal landing page with clear CTAs
* Dashboard layout featuring cards for each agent
* Smooth transitions and animations with Framer Motion
* Fully responsive design for all devices
* Consistent color palette and modern typography inspired by Quiccle.com

---

## Future Enhancements

* Real-time agent collaboration using WebSockets
* Campaign analytics dashboard for deeper insights
* Visualization of agent conversations and reasoning
* Budget optimization module
* User authentication and role-based permissions

---

## Troubleshooting

| Issue                            | Solution                                                 |
| -------------------------------- | -------------------------------------------------------- |
| `npm: command not found`         | Install Node.js using `brew install node`                |
| `ModuleNotFoundError: packaging` | Run `pip install packaging` inside the backend venv      |
| CORS error                       | Add `flask-cors` or `FastAPI CORSMiddleware`             |
| Port already in use              | Kill running process or change port in `vite.config.js`  |
| Blank page                       | Check `.env` variables and ensure the API URL is correct |

---

## Contributing

1. Fork the repository
2. Create a new branch:

   ```bash
   git checkout -b feature/new-ui
   ```
3. Commit your changes:

   ```bash
   git commit -m "Improved dashboard design"
   ```
4. Push the branch:

   ```bash
   git push origin feature/new-ui
   ```
5. Open a Pull Request


---


## Summary

| Category  | Description                                   |
| --------- | --------------------------------------------- |
| Purpose   | AI-driven marketing campaign automation       |
| Frontend  | React + Vite + Framer Motion       |
| Backend   | Python (Flask/FastAPI) with multi-agent logic |
| AI Engine | Google Generative AI (Gemini API)             |
| Design    | Clean, minimal interface                      |

---
