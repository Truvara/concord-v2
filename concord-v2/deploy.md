# Deployment Guide

This guide explains how to deploy Syncorde (formerly Concord-v2) both locally and using Docker.

## Prerequisites
- Node.js 18+
- npm (comes with Node.js)
- Supabase project (for database and authentication)

## Local Deployment

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd syncorde-v2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add your Supabase credentials and any other required environment variables.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

5. **Build and run for production:**
   ```bash
   npm run build
   npm run start
   ```

## Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t syncorde .
   ```

2. **Run the Docker container:**
   ```bash
   docker run -p 3000:3000 --env-file .env syncorde
   ```

3. **Access the app:**
   - Visit `http://localhost:3000` in your browser.

## Database Setup
- Use the SQL in `database_schema/schema_definitions.md` to set up your Supabase/PostgreSQL database.
- Configure your Supabase project and update the `.env` file with the correct credentials.

## Notes
- Ensure your Supabase project is running and accessible from the app.
- For production, configure environment variables and secrets securely. 