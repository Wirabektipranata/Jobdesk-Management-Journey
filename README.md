# JourneyFX Workspace

### Internal Jobdesk & Project Management System

**Organize. Execute. Achieve.**

![Version](https://img.shields.io/badge/Version-1.0.0-silver)
![Status](https://img.shields.io/badge/Status-In%20Development-blue)
![Platform](https://img.shields.io/badge/Platform-Web-black)
![Access](https://img.shields.io/badge/Access-Internal-red)

---

## About JourneyFX Workspace

JourneyFX Workspace is an internal management system designed to streamline operational activities, task assignments, project management, team coordination, performance monitoring, and management reporting.

The platform provides a centralized workspace for management, administrators, and Persons in Charge (PIC) to manage responsibilities efficiently and professionally.

## Objectives

- Centralize team operations and task management.
- Improve coordination and accountability.
- Monitor individual and team performance.
- Manage project progress and deadlines.
- Simplify operational reporting.
- Improve productivity and transparency.
- Maintain structured management documentation.

---

## Main Features

### 01. Dashboard

- Total task overview.
- Completed tasks.
- Tasks in progress.
- Overdue tasks.
- Weekly priorities.
- Team agenda and schedules.
- Active project monitoring.
- Real-time performance overview (planned).

### 02. Jobs & Project

- Create, edit, and manage tasks.
- Assign tasks to PIC.
- Set task priorities.
- Manage project deadlines.
- Update task progress.
- Search and filter tasks.
- Manage individual responsibilities.
- Monitor project completion.

### 03. PIC & Jobdesk

- Team member profiles.
- Division and responsibility management.
- Individual task assignments.
- Daily and weekly jobdesk.
- Individual performance monitoring.
- Accountability and evaluation.

### 04. Report

- Daily activity reports.
- Weekly management reports.
- Monthly performance reports.
- Individual PIC performance.
- Project achievement reports.
- Task completion analysis.
- Export Excel.
- Export PDF.

### 05. Team Agenda

- Internal meetings.
- Educational webinars.
- Trading community activities.
- Coffee gatherings.
- Content production schedules.
- Project deadlines.
- Operational activities.

### 06. User Management

- User authentication.
- Role-based access control.
- Management access.
- Administrator access.
- PIC access.
- User activity history.
- Notification management.

---

## Management Structure

| PIC | Division |
| --- | --- |
| Jimmy | Coordination & IB |
| Depri | Client & Onboarding |
| Ara | Administration & Database |
| Mas Kus | Community & Event |
| Nathan | Content & Marketing |
| Zuzu | Finance & Quality |

*Initial proposed management structure.*

---

## User Access Levels

| Permission | Super Admin | Management | PIC |
| --- | --- | --- | --- |
| View Team Dashboard | Yes | Yes | Limited |
| Create Tasks | Yes | Yes | Limited |
| Assign Tasks | Yes | Yes | No |
| Update Assigned Tasks | Yes | Yes | Yes |
| Manage Projects | Yes | Yes | Limited |
| View All Reports | Yes | Yes | No |
| Export Reports | Yes | Yes | Limited |
| Manage Users | Yes | No | No |
| Delete Data Permanently | Yes | No | No |

---

## Task Workflow

1. Task Creation
2. PIC Assignment
3. Priority & Deadline
4. Task Execution
5. Progress Update
6. Management Review
7. Task Completion
8. Performance Reporting

## Task Status

| Status | Description |
| --- | --- |
| Pending | Task waiting to be started |
| In Progress | Task is being executed |
| In Review | Task awaiting management review |
| Completed | Task successfully completed |
| Overdue | Incomplete task past its deadline |
| Cancelled | Task has been cancelled |

## Priority Levels

| Priority | Description |
| --- | --- |
| Urgent | Immediate action required |
| High | High-priority responsibility |
| Medium | Standard operational task |
| Low | Flexible or supporting task |

---

## Performance Indicators

- Task Completion Rate
- On-Time Completion Rate
- Project Progress
- Individual PIC Performance
- Overdue Task Ratio
- Weekly Report Submission
- Team Productivity
- Operational Accountability

---

## Design System

JourneyFX Workspace adopts a premium, professional, minimalist, and responsive visual identity.

| Element | Specification |
| --- | --- |
| Design Style | Professional & Minimalist |
| Theme | Premium Dark |
| Primary Color | Midnight Black |
| Secondary Color | Metallic Silver |
| Background | Dark Charcoal |
| Typography | Inter / Sans Serif |
| Layout | Responsive Dashboard |
| Display | Desktop, Tablet & Mobile |
| Interface | Clean & Modern |

---

## Technology Stack

Proposed development stack:

![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-Language-3178C6)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)
![Netlify](https://img.shields.io/badge/Netlify-Deployment-00C7B7)
![GitHub](https://img.shields.io/badge/GitHub-Repository-181717)

| Technology | Function |
| --- | --- |
| React | Frontend development |
| TypeScript | Application programming |
| Vite | Development and build tools |
| CSS / Tailwind CSS | User interface styling |
| Supabase | Database and authentication |
| PostgreSQL | Data management |
| Netlify | Website hosting |
| GitHub | Source code management |

---

## Project Structure

```text
Jobdesk-Management-Journey/
├── public/
│   ├── assets/
│   └── logo/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── schema.sql
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── netlify.toml
├── .env.example
├── .gitignore
└── README.md
```

*Proposed final repository structure.*

---

## Installation & Development

After the required source files and dependencies are configured:

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

### Production Preview

```bash
npm run preview
```

## Deployment Configuration

| Setting | Value |
| --- | --- |
| Hosting Provider | Netlify |
| Production Branch | main |
| Build Command | npm run build |
| Publish Directory | dist |
| Framework | Vite |

---

## Development Roadmap

- [ ] Repository initialization and verification
- [ ] Dashboard interface
- [ ] Jobs & Project interface
- [ ] PIC & Jobdesk management
- [ ] Report interface
- [ ] Responsive mobile interface
- [ ] Database integration
- [ ] User authentication
- [ ] Role-based access control
- [ ] Excel and PDF export
- [ ] Notification system
- [ ] Activity log
- [ ] Security testing
- [ ] Production deployment

---

## Security & Privacy

JourneyFX Workspace is intended for authorized internal personnel.

- Protect confidential operational information.
- Do not publish client or member personal data.
- Do not expose passwords or private API keys.
- Store sensitive credentials in environment variables.
- Implement secure authentication.
- Apply database access policies.
- Maintain controlled user permissions.
- Perform regular data backups.

---

## Project Information

| Information | Details |
| --- | --- |
| Project Name | JourneyFX Workspace |
| Repository | Jobdesk-Management-Journey |
| Organization | JourneyFX |
| Category | Internal Management System |
| Version | 1.0.0 |
| Status | Under Development |
| Project Year | 2026 - 2027 |
| Intended Access | Authorized Internal Users |

---

## Ownership

JourneyFX Workspace  
Internal Jobdesk & Project Management System

Copyright © 2026–2027 JourneyFX.  
All rights reserved.

---

### JourneyFX Workspace

**One Team. One Workspace. One Direction.**

*Professional Management. Structured Execution. Sustainable Growth.*
