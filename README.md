# FortressGate: High-Security Visitor Management System

FortressGate is a robust, web-based visitor registration and management system designed for high-security environments like military bases, corporate campuses, and government facilities. It provides a streamlined and secure process for registering visitors, managing personnel, and tracking visit history.

Built with a modern tech stack, this application is designed to be scalable, secure, and user-friendly for gate guards and administrative staff.

## Features

- **User Authentication**: Secure login and registration system for gate guards and other users, powered by Firebase Authentication.
- **Dashboard**: A central hub for managing visitor activity, with separate tabs for currently on-site visitors and past visits.
- **Visitor Registration**: An intuitive form to register new visitors, capture their details, and associate them with the personnel they are visiting.
- **Personnel Management**: A dedicated section to view and add internal personnel, including their rank, department, and location.
- **Real-time Updates**: Visitor and personnel lists update in real-time, powered by Firestore's real-time database capabilities.
- **Visitor Status Tracking**: Easily check visitors in and out, with their status (On-site, Overstaying, Checked-out) clearly displayed.
- **Visit History**: All checked-out visitor records are moved to a "Past Visits" tab, providing a clean audit trail.
- **CRUD Operations**: Includes Create (visitors, personnel), Read (visitors, personnel), Update (visitor status, user profile), and Delete (past visits) functionalities.
- **Responsive UI**: The user interface is built with ShadCN UI and Tailwind CSS, ensuring it is responsive and works seamlessly across desktops and tablets.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Google Firestore
- **Authentication**: Firebase Authentication (Email/Password & Anonymous)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Generative AI (for OCR)**: Google Genkit
- **Deployment**: Firebase App Hosting

## Prerequisites

- Node.js (v18 or later recommended)
- An active Google Firebase project.

## Setup and Installation

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Firebase**:
    - This project is pre-configured to connect to a Firebase project. The configuration is located in `src/firebase/config.ts`.
    - The Firestore security rules are defined in `firestore.rules`. These rules are automatically deployed.

## Seeding the Database

To get started with some initial data, you can run the seed script. This will populate your Firestore `personnel` and `visitors` collections with sample documents.

```bash
npm run seed
```

This command executes the `scripts/seed.ts` file, which connects to your Firestore instance and writes the initial data.

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:9002`.

## Application Structure

-   `src/app/`: Contains all the pages of the application, following the Next.js App Router structure.
    -   `(auth)/`: Handled by middleware, but contains `login/` and `register/` pages.
    -   `dashboard/`: The main dashboard page for visitor management.
    -   `personnel/`: The page for managing internal personnel.
    -   `profile/`: The user profile page.
    -   `layout.tsx`: The root layout for the application.
    -   `page.tsx`: The main landing page.
-   `src/components/`: Contains all React components.
    -   `ui/`: Auto-generated ShadCN UI components.
    -   `dashboard.tsx`: The main dashboard component.
    -   `visitor-registration-form.tsx`: The form for adding new visitors.
    -   `add-personnel-form.tsx`: The form for adding new personnel.
-   `src/firebase/`: Houses all Firebase-related logic.
    -   `config.ts`: Firebase project configuration.
    -   `index.ts`: Central export for Firebase hooks and initialization.
    -   `provider.tsx`: The core Firebase context provider.
    -   `client-provider.tsx`: Client-side wrapper for the Firebase provider.
    -   `firestore/`: Contains custom hooks for interacting with Firestore (`useCollection`, `useDoc`).
-   `src/lib/`: Contains utility functions and data definitions.
-   `docs/backend.json`: A JSON representation of the data models and Firestore structure, used for planning and reference.
-   `firestore.rules`: Defines the security rules for the Firestore database, restricting data access based on user authentication and roles.
-   `scripts/seed.ts`: The script used to populate the database with initial data.

## Core Functionality Guide

### Authentication

- **Registration**: New users can create an account via the `/register` page. Upon successful registration, a user document is created in the `/users` collection in Firestore.
- **Login**: Existing users can sign in through the `/login` page.
- **Session Management**: The app uses Firebase Authentication to manage user sessions. The dashboard and personnel pages are protected and will redirect to the login page if the user is not authenticated.

### Visitor Management (Dashboard)

- **View Visitors**: The dashboard displays two tabs: "Current Visitors" and "Past Visits".
- **Search**: You can search for visitors by name or by the personnel they are visiting.
- **Register a Visitor**: Click the "Register New Visitor" button to open a dialog. Fill in the form to add a new visitor to the system.
- **Check-Out a Visitor**: On each card in the "Current Visitors" tab, click the "Check Out" button. This updates the visitor's status to `Checked-out` and moves their record to the "Past Visits" tab.
- **Delete a Past Visit**: In the "Past Visits" tab, you can permanently delete a visit record by clicking the "Delete Visit" button. A confirmation is required.

### Personnel Management

- **View Personnel**: Navigate to the "Personnel" page to see a table of all registered personnel.
- **Add Personnel**: Click the "Add Personnel" button to open a dialog and add a new employee or service member to the directory. Their record will be saved to the `/personnel` collection in Firestore.
