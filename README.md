# Portfolio Website with Content Management

A modern portfolio website featuring dynamic content management for projects and professional expertise. The content is managed through markdown files, making it easy to add or modify content without changing the code.

## Adding Content

### Projects

To add a new project:

1. Create a new markdown file in `content/projects` directory (e.g., `my-project.md`)
2. Add the required frontmatter:
   ```markdown
   ---
   title: Your Project Title
   description: Brief project description
   publishedAt: YYYY-MM-DD
   thumbnail: /uploads/project-thumbnail.jpg
   type: text
   ---
   ```
3. Write your project content in markdown format below the frontmatter
4. Restart the application to see your changes

The `type` field can be one of:
- `text`: Regular markdown content
- `pdf`: PDF document display
- `slides`: Image slideshow
- `image`: Single image display

Example project structure:
```markdown
---
title: Cloud Migration Strategy
description: Enterprise-scale cloud migration framework
publishedAt: 2024-02-21
thumbnail: /uploads/cloud-migration.jpg
type: text
---

# Cloud Migration Framework

## Overview

This project delivered a comprehensive cloud migration...
```

## File Structure

```
content/
├── projects/
│   ├── example-project.md
│   └── [your-projects].md
├── features/
│   ├── expertise-category.md
│   └── [your-expertise-categories].md
└── services/
    ├── service-name.md
    └── [your-services].md
```

## Images and Files

1. Place all image files in the `uploads` directory
2. Reference images using the path `/uploads/your-image.jpg`
3. For project files (PDFs, etc.), also use the `uploads` directory

## Updating Content

1. To modify existing content, edit the corresponding markdown file
2. To delete content, remove the markdown file
3. Always restart the application after making changes to see your updates
