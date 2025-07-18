# Technical Documentation

## Architecture Overview
Syncorde is built as a modern web application using a modular, scalable architecture. The frontend is developed with Next.js and Material-UI, while Supabase (PostgreSQL) is used for backend data storage and authentication.

### Frontend
- **Framework:** Next.js 14 (React 18)
- **UI:** Material-UI (MUI) v6
- **State Management:** Refine Framework
- **Form Handling:** React Hook Form
- **Charts:** Recharts
- **Type Safety:** TypeScript

### Backend
- **Database:** Supabase (PostgreSQL)
- **API:** Supabase client and server utilities
- **Authentication:** Supabase Auth

### Key Directories
- `src/app/` — Main application routes and pages
- `src/components/` — Shared UI components
- `src/contexts/` — Context providers (e.g., color mode)
- `src/providers/` — Auth, data, and devtools providers
- `src/utils/` — Utility functions (e.g., Supabase integration)
- `database_schema/` — Database schema definitions

## Database Schema
The main tables are:
- **entity**: Organization/entity profiles
- **purpose**: Data processing purposes
- **forms**: Consent forms and configurations
- **preferences**: User/app preferences
- **consents**: User consent records
- **notice**: Privacy notices

Refer to `database_schema/schema_definitions.md` for full SQL definitions.

## Deployment
- **Docker:** Provided Dockerfile for containerized deployment
- **Environment:** Node.js 18+, supports cloud and on-premise

## Extensibility
- Modular codebase for adding new modules or integrations
- JSON schema-based form and preference configuration
- Role-based access and permission management 