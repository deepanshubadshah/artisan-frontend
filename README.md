# Artisan Frontend

This repository contains the ReactJS frontend for the Artisan project. The frontend is built with React (using functional components, hooks, and Redux for state management), and it interacts with the FastAPI backend for lead management. The app includes features like user authentication, data display in a responsive table, filtering, sorting, pagination, and real‑time updates via WebSockets.

## URL: 
Try the app: https://main.d3v82t4zx92fjf.amplifyapp.com/

## Features

- **User Authentication:** Login and protected routes.
- **Responsive Data Table:** Displays lead data with filtering, sorting, and pagination.
- **Real‑time Updates:** Uses WebSockets to receive live updates when leads are added, updated, or deleted.
- **Export to CSV:** Allows users to export lead data.

## Technologies

- **Framework:** ReactJS (with React Hooks)
- **State Management:** Redux
- **HTTP Requests:** Axios and React Query for efficient data fetching
- **UI Components & Styling:** Material-UI (MUI) and custom CSS
- **Real-time Communication:** WebSockets
- **Deployment:** AWS Amplify

## Local Setup & Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Git

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/artisan-frontend.git
   cd artisan-frontend

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
   
3. **Set Up Environment Variables:**
   ```bash
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_WS_URL=wss://localhost:8000/ws
   ```
5. **Running the Application:**
   ```bash
   npm start
   # or
   yarn start
   ```
