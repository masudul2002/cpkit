# CPKit Production Deployment Guide

This document describes how to deploy CPKit to production platforms.

---

## 🚀 Vercel Deployment

CPKit is optimized for Vercel Next.js static pages exports.

1. **Import Repository**: Link your GitHub repository to your Vercel team dashboard.
2. **Compile Command**:
   - Build command: `next build`
   - Output directory: `.next`
3. **Environment variables**:
   - Ensure `NODE_ENV=production` is initialized.
