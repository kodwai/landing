# kodwai — Landing

The marketing site for [kodwai](https://kodwai.com), the AI-agent coding platform.

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**
- **libSQL/Turso** for the blog

## What's here

- Homepage, pricing, about
- Public blog with pagination, OG images, sitemap, RSS
- Newsletter and contact pages
- Footer links to Discord, X/Twitter

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See `.env.local.example` (if present) or copy the keys your deployment needs. Typical values:

```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Project layout

- `src/app/` — Next.js App Router routes
- `src/components/` — shared UI components
- `public/` — static assets
- `PRODUCT.md`, `DESIGN.md` — product and design notes
- `scripts/` — utility scripts

## License

This project is licensed under the **PolyForm Noncommercial License 1.0.0**.

You may use, modify, and distribute it for personal, educational, research, and noncommercial purposes. **Commercial use, including using this code to operate or promote your own product, is not permitted** without a separate commercial license from kodwai.

See [LICENSE](LICENSE) for the full text. For commercial licensing inquiries, contact **hakan@ksenda.com**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security issues: see [SECURITY.md](SECURITY.md).
