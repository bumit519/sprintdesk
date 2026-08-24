# # SprintDesk

SprintDesk is a modern task management dashboard built with React, TypeScript, Vite, and Tailwind CSS.

It provides a workspace for managing tasks, tracking progress, viewing analytics, and organizing work through a drag-and-drop board.

## Features

- Authentication with protected routes

- Dashboard with task statistics

- Task management board

- Drag-and-drop task management

- Task status and priority management

- Analytics dashboard

- Task progress visualization

- Recent task activity

- Notifications

- Responsive UI

- Reusable components

- Lazy-loaded Board and Analytics pages

- Logout functionality



## Tech Stack

- React 19

- TypeScript

- Vite

- Tailwind CSS

- React Router

- Zustand

- Recharts

- Lucide React

- dnd-kit

### Testing & Quality

- Vitest

- React Testing Library

- Testing Library User Event

- Jest DOM

- Oxlint

## Project Structure

```text

src/

├── app/

│   ├── App.tsx

│   └── router.tsx

├── components/

│   ├── ui/

│   └── feedback/

├── features/

│   ├── auth/

│   ├── board/

│   ├── analytics/

│   └── notifications/

├── data/

│   └── mock-data.json

└── main.tsx



---

### STEP 5 — Routes

```md

## Application Routes

| Route | Access | Description |

|---|---|---|

| `/login` | Public | User authentication |

| `/dashboard` | Protected | Dashboard overview |

| `/board` | Protected | Task management |

| `/analytics` | Protected | Analytics and charts |

## Getting Started

### Prerequisites

- Node.js

- npm

### Installation

Clone the repository:

```bash

git clone [https://github.com/bumit519/sprintdesk.git](https://github.com/bumit519/sprintdesk.git)

Navigate to the project:



```
cd sprintdesk
```

Install dependencies:



```
npm install
```

Start the development server:



```
npm run dev
```

The application will run at:



```
http://localhost:5173
```



---

### STEP 7 — Scripts

```md

## Available Scripts

| Command | Description |

|---|---|

| `npm run dev` | Start development server |

| `npm run build` | Create production build |

| `npm run preview` | Preview production build |

| `npm run lint` | Run Oxlint |

| `npm run test` | Run Vitest tests |

## Architecture

SprintDesk follows a feature-based frontend architecture.

```text

User

 │

 ▼

React UI

 │

 ├── Authentication

 ├── Dashboard

 ├── Board

 ├── Analytics

 └── Notifications

 │

 ▼

Feature State / Services

 │

 └── Zustand

The application separates features into independent modules. Authentication, board management, analytics, and notifications have their own components and state logic.

The Board and Analytics pages are lazy-loaded to improve the initial loading experience.



---

### STEP 9 — API Documentation

**Yahan fake API endpoints mat likhna.** Tere current project ke according agar actual backend/API nahi hai, simply:

```md

## API Documentation

SprintDesk currently uses client-side application state and mock data for the assignment demonstration.

Task and dashboard data is maintained through the application's feature state and mock data.

No external API credentials or secrets are required to run the project locally.

## Security

- No passwords, API keys, or sensitive credentials are committed to the repository.

- Authentication routes are protected using route guards.

- Sensitive configuration should be stored in environment variables.

- `.env` files containing secrets should not be committed to Git.

## Performance

The application uses:

- Lazy loading for Board and Analytics

- Vite production builds

- Code splitting

- Reusable components

- Optimized production assets

### Lighthouse Results

| Category | Score |

|---|---:|

| Performance | 99 |

| Accessibility | 96 |

| Best Practices | 100 |

| SEO | 82 |

## Accessibility & Responsive Design

The application is designed for desktop, tablet, and mobile screen sizes.

Accessibility considerations include:

- Semantic HTML

- Keyboard-accessible controls

- Appropriate interactive elements

- Focus states

- Responsive layouts

- Accessible form controls

- Color contrast considerations

## Submission

### GitHub Repository

[https://github.com/bumit519/sprintdesk](https://github.com/bumit519/sprintdesk)

### Live Demo

*Add deployment link here.*

### Screen Recording

*Add screen recording link here.*

### Architecture Document

*Add architecture document link here.*

### API Documentation

*Add Swagger/OpenAPI link here if available*

