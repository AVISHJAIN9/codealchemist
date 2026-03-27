# 🚀 Quick Start Guide

## One-Line Startup (macOS/Linux)

```bash
cd "final fake detection file /mainpage" && npm install && npm run dev
```

Then open: **http://localhost:5173**

## What You Get

A beautiful unified landing page with cards for each project:

```
┌─────────────────────────────────────────┐
│      🎨 TruthGuard Hub                  │
│   Unified Security & Verification       │
├─────────────────────────────────────────┤
│  ┌────────────  ┌────────────           │
│  │ 🛡️  Call    │ 📹 Camera             │
│  │ Detection   │ Tamper                │
│  └────────────  └────────────           │
│  ┌────────────  ┌────────────           │
│  │ 🗂️ Media    │ ⚡ TruthLence         │
│  │ Vault       │                       │
│  └────────────  └────────────           │
│  ┌────────────  ┌────────────           │
│  │ 🔒 Extension│ 📊 Dashboard          │
│  │             │                       │
│  └────────────  └────────────           │
└─────────────────────────────────────────┘
```

All with:
- ✨ NVIDIA-inspired dark theme
- 🎨 Smooth animations
- 🔗 Click-to-navigate links
- 📱 Mobile responsive
- 🎯 Professional design

## File Structure Created

```
✅ Created Files:
  • /mainpage/src/pages/Hub.tsx
  • /mainpage/src/components/Navigation.tsx
  • /main_folder/HUB_SETUP_GUIDE.md (this guide)

✅ Modified Files:
  • /mainpage/src/App.tsx (routing)
  • /mainpage/src/index.css (theme)
```

## Port Configuration

| Project | Port | Status |
|---------|------|--------|
| Hub (mainpage) | 5173 | Primary |
| Call Detection | 5173 | Via mainpage |
| Camera Temper | 5174 | Separate |
| MediaVault | 5175 | Separate |
| TruthLence | 5176 | Separate |

## How It Works

1. **Hub Page** (`/`) - Landing page with all project cards
2. **Dashboard** (`/dashboard`) - Main application interface
3. **External Links** - Click cards to open other projects on different ports

## Customization (5 Minutes)

### Change Colors
Edit `Hub.tsx` line ~24-59:
```typescript
color: "from-red-600 to-pink-600"  // Change to any Tailwind colors
```

### Change Text
Edit `Hub.tsx` project titles and descriptions

### Add Projects
Duplicate a project object in the `projects` array and update the link

## Development Tips

### Hot Reload
Changes to `Hub.tsx` automatically refresh in browser

### View Source
```bash
# From mainpage directory
cat src/pages/Hub.tsx
```

### Check CSS
```bash
cat src/index.css | tail -20
```

## Common Tasks

### In a New Terminal Tab
```bash
# Stop mainpage (Ctrl+C), then start another project:
cd "final fake detection file /camara-temper"
npm run dev
```

### To Change a Link
Open `mainpage/src/pages/Hub.tsx`, find the project in the `projects` array, and update the `link` field.

### To Update the Hub Theme
Edit `mainpage/src/index.css` - look for "NVIDIA Theme" section

## Testing Checklist

- [ ] Hub loads at http://localhost:5173
- [ ] All 6 project cards are visible
- [ ] Cards have hover effects
- [ ] Background animations are smooth
- [ ] Mobile view looks good (resize browser)
- [ ] Click a card (it will try to navigate)
- [ ] Footer is visible

## What If It Doesn't Work?

1. **"Cannot find module"**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port already in use**
   ```bash
   # Check what's using port 5173
   lsof -i :5173
   # Kill it
   kill -9 <PID>
   ```

3. **CSS not loading**
   ```bash
   npm run build
   npm run dev
   ```

## What's Included in the Hub?

✅ Responsive grid layout (1 col on mobile, 2 on tablet, 3 on desktop)
✅ 6 project cards with icons from Lucide React
✅ Color-coded gradient backgrounds
✅ Smooth animations and transitions
✅ Interactive hover effects
✅ Professional feature section
✅ Footer with links
✅ Dark mode with cyan/blue/purple theme
✅ Anti-aliased text with gradients
✅ Mobile-optimized UI

## Next Level Customization

### Add Social Media Links to Footer
Edit `Hub.tsx` line ~189-200

### Change Hero Title
Edit `Hub.tsx` line ~58

###  Add More Projects
Update the `projects` array in `Hub.tsx`

### Change Fonts
Edit `tailwind.config.ts` to add custom fonts

## Project Roadmap

- ✅ Hub created with NVIDIA theme
- ✅ Routing configured
- ✅ Navigation component ready
- ⏳ Multi-portal setup guide (next)
- ⏳ Docker compose file (optional)
- ⏳ Production deployment guide (optional)

## Support Files

- 📖 `HUB_SETUP_GUIDE.md` - Full documentation
- 🚀 `QUICK_START.md` - This file
- 📁 Project structure documented above

---

**Status**: ✅ Ready to Use  
**Last Updated**: March 27, 2026  
**Theme**: NVIDIA Dark Mode  
**Framework**: React + TypeScript + Tailwind CSS
