# Running the Portfolio Application Locally

This guide will help you set up and run the Portfolio application on your local machine or any platform outside of Replit.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- [npm](https://www.npmjs.com/) (version 8.x or higher)
- [PostgreSQL](https://www.postgresql.org/) (version 14.x or higher)
- Git (optional, for cloning the repository)

## Setup Instructions

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

Or download and extract the zip file from the repository.

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

Create a PostgreSQL database for the application:

```bash
createdb portfolio_db
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory of the project with the following content:

```
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
PORT=3000
```

Replace `username` and `password` with your PostgreSQL credentials. If you're using a PostgreSQL instance without a password on localhost, you can use:

```
DATABASE_URL=postgresql://localhost:5432/portfolio_db
```

### 5. Initialize the Database Schema

The application uses Drizzle ORM for database operations. To set up your database schema, run:

```bash
npm run db:push
```

This will create all necessary tables in your database based on the schema defined in the application.

### 6. Adding Initial Content

The application loads content from Markdown files in the `content` directory. Example content is provided in the repository:

- `content/blog/` - Blog posts
- `content/projects/` - Portfolio projects
- `content/services/` - Service offerings
- `content/features/` - Professional expertise/features

You can modify these files or add new ones following the same structure.

### 7. Starting the Application

To start the application in development mode with hot reloading:

```bash
npm run dev
```

For production environments:

```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000` (or the port you specified in your environment variables).

## Application Structure

- `client/` - React frontend
- `server/` - Express backend
- `shared/` - Shared TypeScript types and utilities
- `content/` - Markdown content files
- `uploads/` - User uploaded files (created at runtime)

## Common Tasks

### Adding New Services

Create a new markdown file in `content/services/` following this template:

```markdown
---
title: Service Name
icon: IconName
description: Brief description of the service
---

# Service Title

Detailed description of the service.

- Bullet point 1
- Bullet point 2
- Bullet point 3
```

Icons should correspond to [Lucide icons](https://lucide.dev/icons/) names.

### Adding New Projects

Create a new markdown file in `content/projects/` following this template:

```markdown
---
title: Project Title
slug: project-slug
description: Brief project description
thumbnail: /path/to/thumbnail.jpg
type: text
technologies:
  - Technology 1
  - Technology 2
challenge: Description of the challenge
approach: Description of your approach
implementation: Technical implementation details
outcomes:
  - Outcome 1
  - Outcome 2
---

# Project Title

Detailed project description...
```

### Updating Blog Posts

Create or modify markdown files in `content/blog/` following this template:

```markdown
---
title: Blog Post Title
slug: blog-post-slug
excerpt: Brief excerpt of the blog post
thumbnail: /path/to/thumbnail.jpg
publishedAt: 2023-01-01
---

# Blog Post Title

Blog post content in markdown format...
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify your PostgreSQL service is running
2. Check your DATABASE_URL in the .env file
3. Make sure your database user has appropriate permissions

### Content Not Appearing

If you've added content but it doesn't appear:

1. Make sure your markdown files follow the correct format with proper frontmatter
2. Restart the application to reload content from files
3. Check the server logs for any errors during content loading

### API Endpoint Issues

If API endpoints are not working:

1. Check the server logs for errors
2. Verify that the endpoint path is correct
3. Check your browser's network tab to see the request/response details

## Deployment Considerations

When deploying to production environments:

1. Set up proper environment variables for production
2. Configure a production-ready PostgreSQL database
3. Use a process manager like PM2 to keep the application running
4. Set up proper NGINX or similar for routing and SSL

For cloud deployments (AWS, GCP, Azure, etc.), follow their specific guidelines for Node.js applications with PostgreSQL databases.