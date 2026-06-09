# Fleet Tracking Dashboard

A real-time fleet tracking dashboard built with React, TypeScript, and WebSocket integration. Built as part of the LogiNext UI Programming Challenge.

---

## Tech Stack

- **React** with TypeScript
- **Vite** (Create React App alternative)
- **TanStack Query** (React Query) for data fetching and cache management
- **Bootstrap** for UI components
- **WebSocket** for real-time vehicle updates

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- npm (comes with Node.js)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nisudave43/loginext-casestudy.git
cd fleet-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Features

- **Vehicle list** — paginated table with status, speed, destination, location, and last update
- **Fleet statistics** — summary cards showing total, moving, idle, and delivered counts
- **Status filters** — filter vehicles by All, Idle, En Route, or Delivered
- **Vehicle detail modal** — click any vehicle row to see full details
- **Real-time updates** — WebSocket connection syncs vehicle data every 3 minutes
- **Live timestamp** — shows time since last update and countdown to next update

---
