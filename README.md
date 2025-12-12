markdown
# Ultra-Premium AI Portfolio Website

A cinematic, AI-themed portfolio website featuring glassmorphism, fluid animations, particle effects, and immersive interactions.

## Features

- **Cinematic Video Background**: Immersive full-screen looping video with gradient overlay
- **Glassmorphism Design**: Modern glass-like UI elements with blur effects
- **Particle Animation**: Interactive particle system with mouse interaction
- **Magnetic Cursor**: Custom cursor with magnetic attraction to interactive elements
- **Title Rotator**: Dynamic rotating job titles in hero section
- **3D Skill Cubes**: Interactive skill cubes with hover rotation
- **Project Cards**: Animated project cards with parallax effects
- **Contact Form**: Animated form with validation and feedback
- **GSAP Animations**: Smooth scroll-triggered animations throughout
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Sound Effects**: Subtle interaction sounds (requires uncommenting in JS)

## Installation & Setup

1. **Clone or download** the project files
2. **Folder structure**:
/ai-portfolio
├── /assets
│ ├── /video
│ │ ├── background-video.mp4
│ │ └── background-video.webm
│ ├── /images
│ │ ├── profile.jpg
│ │ └── fallback-bg.jpg
│ └── /icons
├── /css
│ └── style.css
├── /js
│ └── script.js
├── index.html
└── README.md

text

3. **Add your own assets**:
- Replace placeholder video files in `/assets/video/`
- Add your profile image as `/assets/images/profile.jpg`
- Add fallback background image as `/assets/images/fallback-bg.jpg`

4. **Open `index.html`** in a browser to view the portfolio

## Customization

### Personal Information
Edit the following in `index.html`:
- Name in hero section
- Title rotator text
- About me content
- Contact information
- Social media links

### Colors
Modify CSS variables in `:root` section of `css/style.css`:
```css
:root {
 --primary: #6366f1;
 --secondary: #8b5cf6;
 --tertiary: #10b981;
 --accent: #f59e0b;
 /* ... */
}