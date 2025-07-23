# 🏙️ 3D Smart City Visualization

A stunning, interactive 3D smart city built with React Three Fiber that runs entirely in your web browser. Experience a realistic urban environment with animated traffic lights, swaying trees, detailed buildings, and real-time city metrics.

![Smart City Preview](https://img.shields.io/badge/3D-City-blue?style=for-the-badge&logo=three.js)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)

## ✨ Features

### 🏗️ **Realistic Urban Architecture**
- **4 Building Types**: Office towers, residential complexes, mixed-use buildings, and hotels
- **Detailed Structures**: Foundations, roofs, windows, balconies, and entrance doors
- **Interactive Elements**: Buildings glow when hovered
- **Urban Planning**: Downtown core with decreasing density toward suburbs

### 🌳 **Living Environment**
- **Animated Trees**: Gentle swaying motion with detailed trunk and foliage
- **Street Infrastructure**: Lamp posts, traffic lights, and park benches
- **Road System**: Main boulevards, secondary streets, and sidewalks
- **Green Spaces**: Corner parks for urban breathing room

### 🚦 **Smart City Features**
- **Animated Traffic Lights**: Realistic red-yellow-green cycling
- **Real-time Clock**: Live time and date display
- **City Metrics Dashboard**: Infrastructure status monitoring
- **Weather Display**: Current conditions indicator

### 🎮 **Interactive Controls**
- **Mouse Navigation**: 
  - Click + Drag to rotate view
  - Scroll wheel to zoom in/out
  - Middle-click + Drag to pan
- **Hover Effects**: Buildings respond to mouse interaction
- **Smooth Animations**: 60fps performance with optimized rendering

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | ^18.0.0 |
| **Next.js** | Full-stack Framework | ^14.0.0 |
| **TypeScript** | Type Safety | ^5.0.0 |
| **React Three Fiber** | 3D React Renderer | ^8.15.0 |
| **Three.js** | 3D Graphics Engine | ^0.158.0 |
| **Drei** | 3D Utilities | ^9.88.0 |
| **Tailwind CSS** | Styling | ^3.3.0 |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/3d-smart-city.git
   cd 3d-smart-city
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Main page component
│   └── smart-city/
│       └── components/
│           └── WindlandClone.tsx # 3D Smart City component
├── components/                  # Shared UI components
└── styles/                     # Global styles
```

## 🎯 Core Components

### 🏢 **Building System**
```typescript
<DetailedBuilding 
  position={[-5, 0, -5]} 
  height={15} 
  width={4} 
  depth={4} 
  type="office"
  hasBalconies={false}
/>
```

### 🌲 **Natural Elements**
```typescript
<RealisticTree 
  position={[-12, 0, -12]} 
  scale={0.8} 
/>
```

### 🚦 **Infrastructure**
```typescript
<TrafficLight position={[-2, 0, -2]} />
<StreetLamp position={[-22, 0, -25]} />
<ParkBench position={[-16, 0, -14]} />
```

## 🎨 Customization

### **Adding New Buildings**
```typescript
// Add to Scene component
<DetailedBuilding 
  position={[x, 0, z]}     // 3D position
  height={12}              // Building height
  width={3}                // Building width  
  depth={4}                // Building depth
  type="residential"       // office | residential | mixed | hotel
  hasBalconies={true}      // Add balconies (residential only)
/>
```

### **Modifying City Layout**
- Edit street positions in `CityGround` component
- Adjust building density by changing position arrays
- Add new infrastructure by expanding street element arrays

### **Customizing Materials**
```typescript
// Building colors and materials
const getBuildingProps = () => {
  switch (type) {
    case 'residential':
      return {
        color: '#8B7355',      // Main building color
        windowColor: '#FFE135', // Window glow color  
        roofColor: '#654321'    // Roof color
      };
  }
};
```

## 🔧 Development

### **Key Hooks Used**
- `useRef<THREE.Group>()` - Direct 3D object references
- `useFrame()` - Animation loop (60fps)
- `useState()` - Interactive state management
- `useEffect()` - Component lifecycle management

### **Performance Tips**
- Use `useRef` for 3D objects to avoid unnecessary re-renders
- Group similar geometries for efficient rendering
- Limit real-time animations to essential elements
- Use `useMemo` for expensive calculations

### **Common Issues**

**Build Errors:**
```bash
# If you get TypeScript/ESLint errors
npm run build -- --no-lint
```

**Performance Issues:**
- Reduce number of buildings if frame rate drops
- Lower geometry detail (fewer segments in cylinders/spheres)
- Disable shadows if needed: remove `castShadow` props

## 📱 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Best performance |
| Firefox 88+ | ✅ Full | Good performance |
| Safari 14+ | ✅ Full | iOS/macOS compatible |
| Edge 90+ | ✅ Full | Chromium-based |

## 🎮 Controls Guide

| Action | Control | Description |
|--------|---------|-------------|
| **Rotate** | Left Click + Drag | Orbit around the city |
| **Zoom** | Mouse Wheel | Zoom in/out |
| **Pan** | Middle Click + Drag | Move view horizontally |
| **Reset** | Double Click | Return to default view |
| **Interact** | Hover | Buildings highlight on mouseover |

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm i -g vercel
vercel --prod
```

### **Netlify**
```bash
npm run build
# Upload 'out' folder to Netlify
```

### **Traditional Hosting**
```bash
npm run build
npm run export
# Upload 'out' folder to your web server
```

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### **Contribution Ideas**
- 🚗 Add moving vehicles
- 🌧️ Weather effects (rain, snow)
- 🌅 Day/night cycle
- 🔊 Ambient city sounds
- 📊 Real city data integration
- 🏃‍♂️ Walking pedestrians

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** community for the amazing 3D engine
- **React Three Fiber** team for React integration
- **Vercel** for excellent Next.js hosting
- **Urban planning** inspiration from modern smart cities

## 📞 Support

- 🐛 Issues: [Mony Cheng]([https://github.com/yourusername/3d-smart-city/discussions](https://github.com/MonyCheng))
- 💼 LinkedIn: [Phearunmony chheng]([https://twitter.com/yourusername](https://www.linkedin.com/in/phearunmony-chheng-45a4a5231/))

---

**Made with ❤️ and React Three Fiber**

*Experience the future of urban visualization in your browser!*
