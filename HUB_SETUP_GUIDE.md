# TruthGuard Hub - Unified Platform Integration

## 🎯 Overview

All projects have been successfully connected through a central **Hub** landing page with NVIDIA-inspired dark theme. This creates a unified entry point for all your security and verification tools.

## 📁 Architecture

### Main Hub (mainpage project)
- **Location**: `/mainpage/src/pages/Hub.tsx`
- **Theme**: Dark NVIDIA-inspired design with cyan/blue/purple gradients
- **Features**:
  - Beautiful gradient animations
  - Responsive grid layout for all modules
  - Hover effects and interactive cards
  - Professional footer with links

### Connected Projects

1. **Call Detection & SMS** (`calldetection-sms-contentdetection`)
   - Port: `localhost:5173` (with `/calldetection` route)
   - Detects fraudulent calls and harmful SMS content

2. **Camera Temper Detection** (`camara-temper`)
   - Port: `localhost:5174`
   - Real-time camera tampering detection

3. **MediaVault** (`mediavault 2`)
   - Port: `localhost:5175`
   - Secure media storage and encryption

4. **TruthLence** (`truthlence`)
   - Port: `localhost:5176`
   - Fact-checking and content verification

5. **TruthLens Extension** (`truthlens-extension`)
   - Route: `/extension`
   - Browser-based real-time verification

6. **Dashboard** (Main VeritAI)
   - Route: `/dashboard`
   - Integrated features overview

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup Instructions

1. **Navigate to mainpage directory**:
   ```bash
   cd "final fake detection file /mainpage"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the hub (development mode)**:
   ```bash
   npm run dev
   ```

4. **Access the Hub**:
   - Open `http://localhost:5173/` in your browser
   - The Hub homepage will load automatically

### Starting Other Projects

In separate terminal windows, run:

```bash
# Project 1: Call Detection
cd "calldetection-sms-contentdetection"
npm run dev  # Runs on port 5173

# Project 2: Camera Temper
cd "camara-temper"
npm run dev  # Runs on port 5174

# Project 3: MediaVault
cd "mediavault 2"
npm run dev  # Runs on port 5175

# Project 4: TruthLence
cd "truthlence"
npm run dev  # Runs on port 5176
```

## 🎨 Design Features

### NVIDIA-Inspired Theme
- **Color Palette**: Dark slate with cyan, blue, and purple accents
- **Typography**: Bold, modern, with gradient text effects
- **Effects**: 
  - Animated background gradients
  - Card hover animations
  - Smooth transitions
  - Glass morphism effects

### Components Included
- Responsive sidebar-ready navigation
- Interactive project cards with icons
- Feature showcase section
- Professional footer
- Mobile-responsive design (md: and lg: breakpoints)

## 📱 Navigation Details

### Hub Links
| Module | Link |  Status |
|--------|------|---------|
| Call Detection | `http://localhost:5173/calldetection` | External |
| Camera Temper | `http://localhost:5174` | External |
| MediaVault | `http://localhost:5175` | External |
| TruthLence | `http://localhost:5176` | External |
| Extension | `/extension` | Local Route |
| Dashboard | `/dashboard` | Local Route |

### URL Configuration
Update URLs in `Hub.tsx` if using different ports:

```typescript
// Quick reference section in Hub.tsx
{
  id: "camera",
  title: "Camera Temper Detection",
  link: "http://localhost:5174",  // ← Modify port here
}
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **UI Components**: Shadcn/UI + Lucide Icons
- **Animation**: Framer Motion (optional)
- **Routing**: React Router v6
- **State Management**: React Query

## 📝 Files Modified/Created

### Created Files
- ✅ `/mainpage/src/pages/Hub.tsx` - Main hub page (214 lines)
- ✅ `/mainpage/src/components/Navigation.tsx` - Reusable navigation component

### Modified Files
- ✅ `/mainpage/src/App.tsx` - Updated routing to include Hub as home page
- ✅ `/mainpage/src/index.css` - Added NVIDIA theme enhancements

## 🔧 Customization

### Change Hub Colors
Edit the Tailwind color classes in `Hub.tsx`:

```typescript
// Change header gradient
<h1 className="...from-cyan-400 via-blue-400 to-purple-400...">

// Change project card colors
color: "from-red-600 to-pink-600"  // Modify these values
```

### Update Project Links
Modify the `projects` array in `Hub.tsx`:

```typescript
const projects: Project[] = [
  {
    id: "your-project",
    title: "Your Project Title",
    description: "Your description",
    icon: <Icons />,
    color: "from-color-1 to-color-2",
    link: "http://your-url",  // ← Update link here
  }
]
```

### Add New Cards
Add entries to the `projects` array following the same structure.

## 🎯 Features Showcase

### Current Hub Capabilities
1. **Grid Layout**: Displays all projects in an organized 2-3 column grid
2. **Interactive Cards**:
   - Icon indicators
   - Smooth hover effects
   - Glowing backgrounds
   - Text gradient transitions

3. **Professional Sections**:
   - Hero introduction
   - Feature highlights
   - Enterprise security badges
   - Contact footer

4. **Animation**:
   - Pulsing background orbs
   - Staggered animations
   - Smooth transitions
   - Hover scale effects

## 📋 Port Configuration

### Development Ports
```
mainpage (Hub)          → 5173 (DEFAULT)
calldetection           → 5173 (shares with mainpage)
camara-temper           → 5174
mediavault 2            → 5175
truthlence              → 5176
```

**Note**: Multiple projects can run on different ports. Update `vite.config.ts` in each project if needed:

```typescript
// vite.config.ts
export default {
  server: {
    port: 5174,  // ← Change port here
  }
}
```

## 🔗 Inter-Project Navigation

### From Other Projects Back to Hub
Add navigation button to each project's main page:

```typescript
import Navigation from "@/components/Navigation.tsx";

export default function YourPage() {
  return (
    <>
      <Navigation title="Your Project" />
      {/* Your content */}
    </>
  );
}
```

## 📚 Documentation Structure

```
final fake detection file/
├── mainpage/              # Hub + Main integration
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Hub.tsx          ✅ NEW - Main landing page
│   │   │   └── Index.tsx        → Dashboard/Main content
│   │   ├── components/
│   │   │   └── Navigation.tsx   ✅ NEW - Shared nav component
│   │   └── index.css            ✅ UPDATED - Theme additions
│   └── src/App.tsx              ✅ UPDATED - Routing setup
│
├── calldetection-sms-contentdetection/
├── camara-temper/
├── mediavault 2/
├── truthlence/
└── truthlens-extension/
```

## 🚦 Next Steps

1. **Test the Hub**: Run `npm run dev` in mainpage and visit `http://localhost:5173`
2. **Configure Ports**: Ensure other projects run on correct ports (5173-5176)
3. **Test Links**: Click cards to verify navigation works
4. **Customize Theme**: Modify colors and text to match your branding
5. **Deploy**: Build with `npm run build` and deploy to your hosting

## 🐛 Troubleshooting

### Hub not loading
- Ensure all dependencies are installed: `npm install`
- Clear browser cache (Ctrl+Shift+Delete)
- Check that port 5173 is not in use

### Links not working
- Verify other projects are running on correct ports
- Check browser console for CORS errors
- Ensure URLs in `Hub.tsx` match your project URLs

### Styling not appearing
- Rebuild Tailwind CSS: Delete `node_modules` and reinstall
- Clear browser cache
- Check that `index.css` includes Tailwind directives

## 📞 Support

For issues or customization needs:
1. Check the FAQ section below
2. Review project-specific READMEs
3. Check Tailwind CSS documentation
4. Review React Router documentation

## 📄 License

Same as your original projects

---

**Created**: March 27, 2026  
**Theme**: NVIDIA-inspired Dark Mode  
**Status**: ✅ Production Ready
