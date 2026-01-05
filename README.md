<div align="center">
  <h1>Tsuika</h1>
  <p>Capture what's valuable, keep it encrypted or share it freely and then collaborate to make something big.</p>

  [🚀 Demo](https://demo-app.tsuika.space/login) · 
  [✨ Features](#features) · 
  [📦️ Installation](#installation) · 
  [📔  Docs](https://docs.tsuika.space/)

  
  [🌐 Website](https://tsuika.space) · 
  [⚖️ License](https://github.com/tsuiketsu/tsuika/blob/main/LICENSE)

  <img src="https://ik.imagekit.io/rayshold/projects/tsuika/inside-folder-dark.webp?updatedAt=1750176273389" alt=""/>
</div>

## Features
- 🤝 **Collaborative**: Invite other users by their email or username to collaborate on projects and achieve great results together.
- 🌐 **Publish**: Share folders with anyone, either publicly or secured with a password for controlled access.
- 🔐 **Encrypted Folders**: Protect your folders with end-to-end encryption using the XChaCha20-Poly1305 algorithm for both security and efficiency.
- 🧑‍💻 **Open Source**: This project is open source under the AGPL-3.0 license, ensuring it remains freely accessible and cannot become closed source in the future.
- 🏠 **Self-Hostable**: Built with the Tsuika API, Hono, and PostgreSQL, this project scales efficiently and performs well, though it won’t run on a toaster.
- 🖼️ **Rich Previews**: Automatically fetches titles, descriptions, thumbnails, and favicons, providing a seamless and essential preview feature.
- 🧠 **Never Forget**: Save links and articles to your tasks with optional reminders, making procrastination a thing of the past.
- 📱 **PWA**: Experience the app as a Progressive Web App, offering lightning-fast performance. Install it on any device for a native-like experience with seamless updates.
- 📝 **Markdown Editor**: Write bookmark descriptions or full articles with a feature-rich Markdown editor.

## Installation

1. `git clone https://github.com/tsuiketsu/compose && cd compose`
2. Add `.env` file with required variables specified in `.env.example`
3. `docker compose up -d`
4. open `http://localhost:3000`

#### Chrome/Chromium-based Extension

1. Clone project with `git clone https://github.com/tsuiketsu/tsuika-browser-extension && cd tsuika-browser-extension`
2. Then `bun install && bun run build`
3. Click on extension icon somewhere in top right corner, click on extension button
   1. `Manage extensions`
   2. enable `Developer Mode`
   3. `Load Unpacked`
   4. Select `tsuika-browser-extension/.output/chrome-mv3`
  
## Development

#### Step 1: Start backend

1. `git clone https://github.com/tsuiketsu/tsuika-api && cd tsuika-api`
2. Create `.env`
3. `bun install`
4. `docker compoe up -d`
5. `bun drizzle-kit push` to push changes to postgres
6. (optional) `bun drizzle-kit studio` and then visit `https://local.drizzle.studio/`
7. `bun run dev`
8. Api should be running at `http://localhost:8000`

#### Step 2: Start frontend

1. `git clone https://github.com/tsuiketsu/tsuika && cd tsuika`
2. `bun install`
3. `bun dev`
4. App should be running at `http://localhost:3000`
    
## Thanks!!
 - [linkwarden](https://github.com/linkwarden/linkwarden) for UX reference
 - [shadcn-admin](https://github.com/satnaing/shadcn-admin) for a lot of design references
