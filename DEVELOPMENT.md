# CPKit Developer Guide

Follow this guide to set up local workspaces, run debugging, and build tests.

---

## 🛠️ Local Setup

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

2. **Launch developer sandbox**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to verify live updates.

---

## 🔍 Validation & Tests

Before submitting a Pull Request, verify code cleanliness:

1. **Linter checks**:
   ```bash
   npm run lint
   ```
2. **Next.js static compilation**:
   ```bash
   npm run build
   ```
