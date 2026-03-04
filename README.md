#  Portfolio

Personal portfolio website built with Next.js, featuring an interactive terminal, blog, and dynamic GitHub project integration.

## Live

[GitHub Profile](https://github.com/lordon1a)

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- MDX for blog posts
- Vercel Analytics & Speed Insights

## Features

- Interactive terminal on homepage
- Dynamic GitHub repository fetching with star counts
- Blog with MDX support and syntax highlighting
- SEO optimized (sitemap, robots, JSON-LD schema)
- Pages: Home, Projects, Experience, Education, Achievements, Skills, Contact, Blog

## Development

```bash
pnpm install
pnpm dev
```

## Deployment

Deployed on [Vercel](https://vercel.com).


## Admin Panel

Access the admin panel at `/admin` to manage projects.

### Setup

1. Create a `.env.local` file in the root directory
2. Add your admin password:
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
   ```
3. Access the admin panel at `http://localhost:3000/admin`
4. Login with your password

### Features

- Add new projects
- Edit existing projects
- Delete projects
- All changes are saved to `data/projects.json`

### Security

- Password protected access
- Session-based authentication
- Change the default password in production!

