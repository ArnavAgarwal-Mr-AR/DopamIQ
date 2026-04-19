# Multi-User Tool Architecture & Session Flow

## Overview
The application has been transitioned from a "Demo-only" local prototype into a public-facing analytical tool. This architecture allows any user to arrive at the site, upload their Netflix ZIP data, and immediately access an isolated dashboard without an explicit registration process.

## 1. User Identity Generation
Identity is managed entirely on the client-side to keep the application lightweight and privacy-conscious.

*   **Persistence**: The browser uses `localStorage` to store a key named `netflix_user_id`.
*   **Generation**: If a visitor lands on the site without this key, the `UploadDropzone.tsx` component generates a unique `UUID` using `crypto.randomUUID()`.
*   **Isolation**: All data stored in the PostgreSQL database is partitioned by this `user_id`.

## 2. Request Protocol (X-User-ID)
To tell the backend which user is requesting data, the system uses a custom header protocol.

*   **API Client**: The `frontend/src/services/apiClient.ts` intercepts every outgoing fetch request.
*   **Header Injection**: It checks `localStorage` and appends the `X-User-ID` header to all calls.
*   **Backend Resolution**: The FastAPI layer uses a dependency (`get_current_user` in `backend/app/api/dependencies.py`) to parse this header and provide the ID to the service methods.

## 3. UI Gating & Access Control
To ensure a logical product flow, the UI behaves as a "Gate".

*   **Protected Routes**: In `frontend/src/app/routes.tsx`, the Dashboard, Trends, and Simulation pages are protected by a conditional check. If `netflix_user_id` is missing, the router forcefully redirects the user to the `/upload` page.
*   **Clean Mode**: The Sidebar and Navbar are hidden in `frontend/src/app/App.tsx` until the user ID is present, creating a clutter-free landing experience.

## 4. End-to-End Pipeline Workflow
1.  **Landing**: User lands on `/upload`.
2.  **Selection**: User selects their Netflix `ViewingActivity.zip`.
3.  **Process**: 
    *   Frontend generates a new `userId`.
    *   Frontend POSTs to `/api/upload` with the file and the ID in the headers.
    *   Backend hashes the file, checks if THIS user has uploaded THIS file before (Caching).
    *   If new, the ML pipeline runs and stores results under the `userId`.
4.  **Transition**: Upon success, the frontend saves the ID to `localStorage` and performs a `window.location.href = "/"` reload.
5.  **Dashboard**: The full UI (Navbar/Sidebar) unlocks, and the user's personality insights are displayed.

## 5. Privacy Note
Since user IDs are generated randomly and data is scoped to those IDs, users cannot view each other's data as long as they do not share their unique `localStorage` ID. Clearing browser data effectively "signs the user out" and deletes their local access token to that data.
