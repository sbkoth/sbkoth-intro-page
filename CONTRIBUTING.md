# Contributing Guide

Welcome to our freelancer portfolio platform! This guide will help you set up the project locally and understand our development workflow.

## Project Overview

This is a strategic freelancer portfolio platform designed to maximize professional visibility through dynamic, markdown-driven content management and interactive storytelling.

### Tech Stack

- Frontend: React + TypeScript + Vite
- UI Framework: shadcn/ui + Tailwind CSS
- Backend: Express.js
- Database: PostgreSQL
- Content: Markdown-based with gray-matter for frontmatter
- State Management: TanStack Query

## Prerequisites

- Node.js v20 or later
- PostgreSQL v15 or later
- Git

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install Node.js:
   - Required version: v20 or later
   - Download from: https://nodejs.org/

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up PostgreSQL:
   - Install PostgreSQL 15 or later
   - Create a new database:
     ```sql
     CREATE DATABASE portfolio;
     ```
   - The application uses Drizzle ORM for database management

5. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/portfolio

   # Optional: For image uploads
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Optional: For Google Calendar integration
   GOOGLE_CALENDAR_ID=your_calendar_id
   ```

6. Initialize the database:
   ```bash
   npm run db:push
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`.

## Project Structure

```
├── attached_assets/      # Static assets like profile photos
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Page components
├── content/             # Markdown content
│   ├── blogs/          # Blog posts
│   ├── features/       # Feature descriptions
│   ├── services/       # Service offerings
│   └── projects/       # Project showcases
├── server/             # Backend Express application
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data access layer
│   └── utils/          # Utility functions
└── shared/             # Shared TypeScript types and schemas
```

## Production Deployment

### Docker Deployment

1. Create a Dockerfile:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

2. Create docker-compose.yml:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/portfolio
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./content:/app/content
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=portfolio
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. Build and run:
```bash
docker-compose up --build
```

### Web Server Configuration

#### Nginx Setup
```nginx
# /etc/nginx/sites-available/portfolio
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (uncomment if you're sure)
    # add_header Strict-Transport-Security "max-age=63072000" always;

    # Root directory and index
    root /path/to/app/dist/client;
    index index.html;

    # Asset caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    }

    # Everything else goes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache Setup
```apache
# /etc/apache2/sites-available/portfolio.conf
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /path/to/app/dist/client

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem

    # API Proxy
    ProxyPreserveHost On
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api

    # CORS Headers
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"

    # Asset Caching
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js)$">
        Header set Cache-Control "max-age=604800, public"
    </FilesMatch>

    # SPA Routing
    <Directory /path/to/app/dist/client>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.html [QSA,L]
    </Directory>
</VirtualHost>
```

### SSL Certificate Setup

Using Let's Encrypt:

```bash
# Install certbot
sudo apt install certbot

# For Nginx
sudo apt install python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# For Apache
sudo apt install python3-certbot-apache
sudo certbot --apache -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Local Development Troubleshooting

#### Database Issues
1. Connection Errors:
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql

   # Verify connection
   psql $DATABASE_URL -c '\conninfo'

   # Create database if missing
   createdb portfolio
   ```

2. Migration Issues:
   ```bash
   # Clear database and recreate
   dropdb portfolio
   createdb portfolio
   npm run db:push

   # View current schema
   drizzle-kit introspect:pg
   ```

3. Permission Issues:
   ```sql
   -- Grant necessary permissions
   GRANT ALL PRIVILEGES ON DATABASE portfolio TO your_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
   ```

#### Build Issues
1. Clean Install:
   ```bash
   # Remove dependencies and reinstall
   rm -rf node_modules
   rm package-lock.json
   npm cache clean --force
   npm install
   ```

2. TypeScript Errors:
   ```bash
   # Clear TypeScript cache
   rm -rf dist
   rm tsconfig.tsbuildinfo
   npm run type-check
   ```

3. Vite Issues:
   ```bash
   # Clear Vite cache
   rm -rf node_modules/.vite
   ```

### Database Management

#### Backup Procedures
1. Automated Daily Backups:
   ```bash
   #!/bin/bash
   # /etc/cron.daily/portfolio-backup

   BACKUP_DIR="/path/to/backups"
   FILENAME="portfolio-$(date +%Y%m%d).sql"

   # Create backup
   pg_dump $DATABASE_URL > "$BACKUP_DIR/$FILENAME"

   # Compress
   gzip "$BACKUP_DIR/$FILENAME"

   # Keep last 30 days
   find "$BACKUP_DIR" -type f -mtime +30 -delete
   ```

2. Manual Backup:
   ```bash
   # Full backup
   npm run db:backup

   # Backup specific tables
   pg_dump -t table_name $DATABASE_URL > table_backup.sql
   ```

#### Restore Procedures
```bash
# Full restore
psql $DATABASE_URL < backup.sql

# Restore specific tables
psql $DATABASE_URL < table_backup.sql
```

### Environment Configuration

Create different environment files for different environments:

`.env.development`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localhost:5432/portfolio
VITE_API_URL=http://localhost:5000
```

`.env.production`:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://production:password@localhost:5432/portfolio
VITE_API_URL=https://your-domain.com
```

`.env.test`:
```env
NODE_ENV=test
PORT=5000
DATABASE_URL=postgresql://localhost:5432/portfolio_test
VITE_API_URL=http://localhost:5000
```

Load environment variables based on environment:
```bash
# Development
source .env.development

# Production
source .env.production

# Test
source .env.test
```

### PM2 Process Manager

1. Install PM2:
```bash
npm install -g pm2
```

2. Create ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'portfolio',
    script: 'dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
}
```

3. Start with PM2:
```bash
pm2 start ecosystem.config.js
```

### Systemd Service

1. Create service file `/etc/systemd/system/portfolio.service`:
```ini
[Unit]
Description=Portfolio Application
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/path/to/app
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
```

2. Enable and start service:
```bash
systemctl enable portfolio
systemctl start portfolio
```

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/app
            git pull
            npm ci --production
            npm run build
            pm2 reload portfolio
```

## Development vs Production

### Development Environment Features
- Hot module reloading
- Detailed error messages
- Source maps enabled
- In-memory caching
- Development-specific logging

### Production Environment Features
- Optimized builds
- Minified assets
- Error tracking
- Production logging levels
- Performance monitoring

### Production Checklist

Before deploying to production:

1. Security:
   - Enable CORS protection
   - Set up rate limiting
   - Configure security headers
   - Enable HTTPS
   - Set secure cookie options
   - Implement proper authentication

2. Performance:
   - Enable compression
   - Configure caching headers
   - Optimize static assets
   - Set up CDN
   - Configure database indexes

3. Monitoring:
   - Set up error tracking
   - Configure application logging
   - Implement health checks
   - Monitor database performance
   - Track API metrics

4. Backup:
   - Set up database backups
   - Configure content backups
   - Store configuration backups
   - Test restore procedures


## Scripts and Commands

Available npm scripts:

```bash
# Development
npm run dev          # Start development server
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
npm run format      # Run Prettier formatting

# Database
npm run db:push     # Push schema changes to database
npm run db:generate # Generate new migration
npm run db:backup   # Create database backup

# Production
npm run build       # Build for production
npm run start       # Start production server
```

## Environment Variables

Required environment variables:

```env
# Database (Required)
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

# Server (Optional)
PORT=5000                    # Default: 5000
NODE_ENV=production         # Default: development
VITE_API_URL=https://your-domain.com

# Image Upload (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Calendar (Optional)
GOOGLE_CALENDAR_ID=your_calendar_id
```

### Maintenance

1. Regular Updates:
   ```bash
   # Update dependencies
   npm update

   # Check for vulnerabilities
   npm audit

   # Run tests
   npm run test
   ```

2. Database Maintenance:
   ```bash
   # Backup database
   npm run db:backup

   # Check database health
   pg_healthcheck $DATABASE_URL

   # Vacuum database
   psql $DATABASE_URL -c "VACUUM ANALYZE;"
   ```

3. Monitoring:
   ```bash
   # Check application logs
   tail -f /var/log/portfolio.log

   # Monitor database connections
   psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"
   ```

4. Content Management:
   - Regular backups of content directory
   - Monitor disk usage
   - Clean up unused uploads
   - Validate markdown content

### Common Issues and Solutions

1. Database Connection Issues:
   ```bash
   # Check connection
   psql $DATABASE_URL -c '\conninfo'

   # Verify permissions
   psql $DATABASE_URL -c '\du'
   ```

2. Build Problems:
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

3. Server Issues:
   ```bash
   # Check Node.js version
   node --version

   # Verify port availability
   lsof -i :5000
   ```

4. Content Problems:
   ```bash
   # Verify file permissions
   ls -la content/

   # Check file syntax
   npm run content:validate
   ```

### Support and Resources

If you need help:
1. Check the troubleshooting section above
2. Review application logs
3. Open an issue in the repository
4. Contact the development team

For additional resources:
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Database Management
### Backup and Restore

The project includes a script for backing up the database:

```bash
# Create a backup
npm run db:backup

# The backup will be saved in the backup/ directory with timestamp
```

To restore from a backup:

```bash
# Replace <backup-file> with the actual backup file name
psql $DATABASE_URL < backup/<backup-file>
```

## Development Workflow

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code style guidelines

3. Test your changes locally:
   ```bash
   npm run test        # Run tests
   npm run lint        # Run linter
   npm run type-check  # Check TypeScript types
   ```

4. Commit your changes following conventional commits:
   ```
   feat: add new feature
   fix: resolve bug
   docs: update documentation
   style: format code
   refactor: restructure code
   test: add tests
   chore: update dependencies
   ```

5. Push your changes and create a pull request

## Testing Guidelines

- Write tests for new features
- Ensure existing tests pass
- Test across different screen sizes
- Check accessibility using the built-in tools

## Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint configuration
- Use shadcn/ui components when possible
- Keep components small and focused
- Use appropriate semantic HTML elements
- Follow the Tailwind CSS class order convention

## Performance Considerations

- Optimize images before adding them
- Lazy load components when appropriate
- Use proper caching strategies
- Monitor bundle size

## Need Help?

Feel free to:
- Open an issue for bugs
- Start a discussion for features
- Ask questions in our community channels

Thank you for contributing!