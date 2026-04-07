

# Channel Q&A Platform

A Next.js based forum application where users can create channels, post questions and engage in threaded discussions with voting and file attachments.

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm 

## Setup

1. **Clone the repository**
   ```bash
   git clone repo
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the database**
   ```bash
   docker compose up -d
   ```
   This starts PostgreSQL on port 5432.

4. **Set up the database schema**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database with demo data**
   ```bash
   npm run seed
   ```

## Running the Application

### Development
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Using Docker (Alternative)
```bash
docker build -t channel-qa .
docker run -p 3000:3000 channel-qa
```

## Ports

- **Application**: http://localhost:3000
- **Database**: localhost:5432 (PostgreSQL)

## Database

- **Provider**: PostgreSQL
- **Database Name**: channelqa
- **Connection**: `postgresql://postgres:postgres@localhost:5432/channelqa`

### Migrations
To create and apply new migrations:
```bash
npx prisma migrate dev --name <migration-name>
```

### Schema
The database schema includes:
- Users (with authentication)
- Channels (discussion categories)
- Posts (questions/topics)
- Replies (threaded comments)
- Attachments (file uploads)
- Votes (up/down voting)

## Demo Credentials

**Admin User:**
- Email: `omen@example.com`
- Password: `teleportation123`
- Role: admin

The seed script creates this admin user along with sample channels (`javascript`, `python`) and demo posts.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with demo data

## Quick Testing Guide

1. **Start everything**:
   ```bash
   docker-compose up -d
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```

2. **Access the app** at http://localhost:3000

3. **Sign in** with demo credentials:
   - Email: omen@example.com
   - Password: teleportation123

4. **Test features**:
   - Browse channels (javascript, python)
   - View posts and replies
   - Create new posts (requires sign-in)
   - Vote on posts/replies
   - Upload attachments
   - Search functionality

5. **Admin features** (as omen@example.com):
   - Create new channels
   - Full access to all content
   

## Project Structure

- `app/` - Next.js app router pages and API routes
- `lib/` - Utility functions (auth, prisma client)
- `prisma/` - Database schema and migrations
- `components/` - React components
- `public/uploads/` - File upload directory



## Technologies

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom session-based auth with bcrypt
- **Deployment**: Docker support
