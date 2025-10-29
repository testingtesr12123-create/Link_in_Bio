# Link in Bio Application

A full-featured Link in Bio web application built with React, Supabase, and TailwindCSS. Users can create personalized profile pages with multiple external links, customize themes, and track link analytics.

## Features

### User Dashboard
- Create and manage multiple profiles
- Add, edit, delete links with custom titles, URLs, and icons
- Drag-and-drop reordering of links
- Toggle link visibility (show/hide)
- Real-time preview of profile page
- Analytics dashboard showing click statistics

### Public Profile Page
- Accessible via unique username (e.g., `/demo`)
- Responsive mobile-friendly design
- Displays profile picture, name, bio
- Shows all active links with custom icons
- Click tracking for analytics

### Theme Customization
- 5 pre-built themes (Default, Dark, Ocean, Sunset, Minimal)
- Custom colors for background, buttons, and text
- Different button styles (rounded, rounded-full, rounded-lg)
- Profile and background image support

### Analytics
- Total clicks across all links
- Per-link click counts
- Visual performance breakdown
- Click percentage distribution

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite

## Database Schema

### Tables

1. **profiles** - User profile information
   - id, username, display_name, bio
   - profile_image_url, background_image_url
   - theme_id, custom_css
   - created_at, updated_at

2. **links** - Individual links for each profile
   - id, user_id, title, url, icon
   - order_index, click_count, is_active
   - created_at, updated_at

3. **themes** - Pre-built theme configurations
   - id, name, background_color, button_color
   - button_text_color, text_color
   - font_family, button_style

4. **link_clicks** - Click tracking for analytics
   - id, link_id, clicked_at
   - user_agent, referrer

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

### Creating a Profile

1. Visit the home page (`/`)
2. Click "Create New Profile"
3. Enter a username (lowercase, alphanumeric)
4. Enter your display name
5. Click "Create Profile"

### Managing Links

1. Navigate to your dashboard
2. Click the "Links" tab
3. Click "Add Link" to create a new link
4. Fill in title, URL, and select an icon
5. Drag links to reorder them
6. Use the eye icon to show/hide links
7. Use the trash icon to delete links

### Customizing Your Profile

1. Go to the "Profile" tab
2. Update your display name, username, bio
3. Add profile and background image URLs
4. Click "Save Changes"

### Choosing a Theme

1. Go to the "Themes" tab
2. Browse available themes
3. Click on a theme to apply it
4. See the changes in the live preview

### Viewing Analytics

1. Go to the "Analytics" tab
2. View total clicks, active links, and average clicks per link
3. See detailed performance for each link
4. Track which links are most popular

### Accessing Your Public Profile

Your public profile is accessible at: `/{username}`

For example, if your username is "demo", visit `/demo`

## Available Icons

Instagram, Twitter, Facebook, Youtube, Github, Linkedin, Mail, Phone, Globe, Music, Video, ShoppingCart, Coffee, and Link (default)

## Demo Account

A demo profile is available at `/demo` with sample links to explore the features.

## Features Overview

### Dashboard
- Multi-tab interface (Links, Profile, Themes, Analytics)
- Live preview sidebar showing real-time changes
- Intuitive drag-and-drop interface

### Public Profile
- Beautiful, responsive design
- Smooth animations and transitions
- Click tracking without page reload
- Custom themes and branding

### Link Management
- CRUD operations (Create, Read, Update, Delete)
- Visual ordering with drag-and-drop
- Icon selection from popular platforms
- Active/inactive toggle

### Analytics
- Real-time click tracking
- Visual performance charts
- Link-by-link breakdown
- Percentage distribution

## Development

### Project Structure
```
src/
├── components/        # React components
│   ├── Dashboard.tsx
│   ├── LinkManager.tsx
│   ├── ProfileEditor.tsx
│   ├── ThemeSelector.tsx
│   ├── Analytics.tsx
│   ├── LivePreview.tsx
│   ├── PublicProfile.tsx
│   └── ProfileSelector.tsx
├── services/         # API service layer
│   ├── profileService.ts
│   ├── linkService.ts
│   └── themeService.ts
├── lib/             # Configuration
│   └── supabase.ts
├── App.tsx          # Main app component
└── main.tsx        # Entry point
```

### Key Technologies

- **React Hooks**: useState, useEffect for state management
- **Supabase Client**: Real-time database operations
- **TailwindCSS**: Utility-first styling
- **Lucide Icons**: Beautiful, consistent icons
- **TypeScript**: Type safety and better DX

## Security

- Row Level Security (RLS) enabled on all tables
- Public profiles readable by anyone
- Profile updates restricted to owners
- Click tracking anonymous and secure
- No authentication required (as requested)

## Performance

- Optimized bundle size
- Lazy loading of images
- Efficient database queries
- Real-time updates without polling
- Responsive design for all devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This project is for demonstration purposes.
