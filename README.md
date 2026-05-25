# 📓 Notebook – Prompt Management Studio

**A modern, offline-first prompt manager for developers and AI enthusiasts.**
Built with Next.js, Zustand, Dexie, and Tailwind CSS.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-5A0FC8?logo=pwa)]()

---

## ✨ Features

### 🗂️ Smart File Tree

- **Hierarchical folders & files** – organize prompts just like a code editor.
- **Drag & Drop** – move files/folders with visual drop indicators and auto-expand on hover.
- **Inline rename (F2)** – quick rename directly in the tree.
- **Keyboard shortcuts** – Delete key to remove, Escape to cancel.
- **Add files or folders** anywhere in the tree, respecting order (folders before files).

### 📝 Markdown Editor Cards

- **Full Markdown support** – write, preview, and edit rich prompts using `@uiw/react-md-editor`.
- **Double-click to edit** – seamless transition between preview and editing.
- **Per-card direction toggle** (RTL/LTR) – perfect for multilingual content.
- **Copy content** to clipboard with visual feedback.

### 🧩 Groups (Zones)

- Group related prompt cards into collapsible "zones".
- Move groups up/down, rename, add cards to groups.
- **Multi-select cards** (checkbox) and group selected cards into a new zone with one click.

### 🎨 Theme & Layout

- **Dark / Light / System** theme – togglable from the header.
- **Responsive sidebar** – resizable on desktop, overlay drawer on mobile.
- Clean, modern UI with Tailwind CSS custom theme variables.

### 💾 Offline-First Persistence

- All data stored **locally in IndexedDB** via Dexie – works fully offline.
- **Service Worker** – PWA ready, installable on desktop/mobile.
- State automatically syncs between Zustand stores and database.
- No server required – the app is a **fully static export**.

### 🔁 Data Safety

- Delete confirmations for files, folders, cards, and groups.
- Robust drag-and-drop validation (prevents moving a folder into its own subtree).

---

## 🛠️ Tech Stack

| Category         | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org/) (Static Export)                       |
| Language         | [TypeScript](https://www.typescriptlang.org/)                           |
| State Management | [Zustand](https://github.com/pmndrs/zustand)                            |
| Database         | [Dexie.js](https://dexie.org/) (IndexedDB wrapper)                      |
| Styling          | [Tailwind CSS 4](https://tailwindcss.com/) + `tailwind-merge` + `clsx`  |
| Markdown Editor  | [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor)        |
| Icons            | [Lucide React](https://lucide.dev/)                                     |
| Resizable Panels | [react-resizable](https://github.com/react-grid-layout/react-resizable) |
| PWA              | Custom Service Worker, Web Manifest                                     |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm / yarn / pnpm

### Install & Run

```bash
git clone <repo-url>
cd notebook
npm install
npm run dev
Open http://localhost:3003 in your browser.

Build for Production
bash
npm run build
# Output: ./out (fully static – serve with any static file server)
```
