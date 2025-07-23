'use client';

import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import * as THREE from 'three';

// Theme context
const ThemeContext = createContext({
    isDark: false,
    toggleTheme: () => { }
});

// Theme provider
function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Three.js Scene Component
function ThreeScene() {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const animationRef = useRef<number | null>(null);
    const { isDark } = useContext(ThemeContext);

    // Mouse controls
    const mouseRef = useRef({ x: 0, y: 0, isDown: false });
    const cameraPositionRef = useRef({ theta: 0.8, phi: 0.8, radius: 50 });

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(isDark ? 0x0a0a0a : 0x87CEEB);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        mountRef.current.appendChild(renderer.domElement);

        // Store references
        sceneRef.current = scene;
        rendererRef.current = renderer;
        cameraRef.current = camera;

        // Create city
        createCity(scene, isDark);

        // Lighting
        setupLighting(scene, isDark);

        // Camera positioning
        updateCameraPosition(camera);

        // Animation loop
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Mouse controls
        const handleMouseDown = (event: MouseEvent) => {
            event.preventDefault();
            mouseRef.current.isDown = true;
            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;
        };

        const handleMouseUp = (event: MouseEvent) => {
            event.preventDefault();
            mouseRef.current.isDown = false;
        };

        const handleMouseMove = (event: MouseEvent) => {
            event.preventDefault();
            if (!mouseRef.current.isDown) return;

            const deltaX = event.clientX - mouseRef.current.x;
            const deltaY = event.clientY - mouseRef.current.y;

            cameraPositionRef.current.theta -= deltaX * 0.005;
            cameraPositionRef.current.phi += deltaY * 0.005;

            // Limit phi to prevent flipping
            cameraPositionRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.2, cameraPositionRef.current.phi));

            updateCameraPosition(camera);

            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;
        };

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            cameraPositionRef.current.radius += event.deltaY * 0.05;
            cameraPositionRef.current.radius = Math.max(15, Math.min(80, cameraPositionRef.current.radius));
            updateCameraPosition(camera);
        };

        // Add touch support for mobile
        const handleTouchStart = (event: TouchEvent) => {
            event.preventDefault();
            if (event.touches.length === 1) {
                mouseRef.current.isDown = true;
                mouseRef.current.x = event.touches[0].clientX;
                mouseRef.current.y = event.touches[0].clientY;
            }
        };

        const handleTouchEnd = (event: TouchEvent) => {
            event.preventDefault();
            mouseRef.current.isDown = false;
        };

        const handleTouchMove = (event: TouchEvent) => {
            event.preventDefault();
            if (!mouseRef.current.isDown || event.touches.length !== 1) return;

            const deltaX = event.touches[0].clientX - mouseRef.current.x;
            const deltaY = event.touches[0].clientY - mouseRef.current.y;

            cameraPositionRef.current.theta -= deltaX * 0.005;
            cameraPositionRef.current.phi += deltaY * 0.005;

            cameraPositionRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.2, cameraPositionRef.current.phi));

            updateCameraPosition(camera);

            mouseRef.current.x = event.touches[0].clientX;
            mouseRef.current.y = event.touches[0].clientY;
        };

        const canvas = renderer.domElement;
        canvas.style.cursor = 'grab';

        canvas.addEventListener('mousedown', handleMouseDown, { passive: false });
        canvas.addEventListener('mouseup', handleMouseUp, { passive: false });
        canvas.addEventListener('mousemove', handleMouseMove, { passive: false });
        canvas.addEventListener('wheel', handleWheel, { passive: false });

        // Touch events for mobile
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

        // Global mouse up to handle when mouse leaves canvas
        const handleGlobalMouseUp = () => {
            mouseRef.current.isDown = false;
            canvas.style.cursor = 'grab';
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);

        // Change cursor when dragging
        const updateCursor = () => {
            canvas.style.cursor = mouseRef.current.isDown ? 'grabbing' : 'grab';
        };

        canvas.addEventListener('mousedown', updateCursor);
        canvas.addEventListener('mouseup', updateCursor);

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            // Cleanup
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }

            // Remove all event listeners
            const canvas = renderer.domElement;
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('resize', handleResize);

            renderer.dispose();
        };
    }, []);

    // Update scene when theme changes
    useEffect(() => {
        if (sceneRef.current && rendererRef.current) {
            // Clear existing scene
            while (sceneRef.current.children.length > 0) {
                sceneRef.current.remove(sceneRef.current.children[0]);
            }

            // Recreate scene with new theme
            createCity(sceneRef.current, isDark);
            setupLighting(sceneRef.current, isDark);
            rendererRef.current.setClearColor(isDark ? 0x0a0a0a : 0x87CEEB);
        }
    }, [isDark]);

    const updateCameraPosition = (camera: THREE.PerspectiveCamera) => {
        const { theta, phi, radius } = cameraPositionRef.current;
        camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
        camera.position.y = radius * Math.cos(phi);
        camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
        camera.lookAt(0, 5, 0); // Look at city center, slightly elevated
    };

    return <div ref={mountRef} className="w-full h-full" />;
}

// Create city function
function createCity(scene: THREE.Scene, isDark: boolean) {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({
        color: isDark ? 0x1a1a1a : 0x2a2a2a
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Streets
    createStreets(scene, isDark);

    // Buildings
    createBuildings(scene, isDark);

    // Trees
    createTrees(scene, isDark);

    // Street elements
    createStreetElements(scene, isDark);
}

function createStreets(scene: THREE.Scene, isDark: boolean) {
    const streetColor = isDark ? 0x0a0a0a : 0x1a1a1a;
    const secondaryStreetColor = isDark ? 0x222222 : 0x333333;

    // Main streets
    const mainStreetGeometry = new THREE.PlaneGeometry(4, 100);
    const mainStreetMaterial = new THREE.MeshLambertMaterial({ color: streetColor });

    const mainStreet1 = new THREE.Mesh(mainStreetGeometry, mainStreetMaterial);
    mainStreet1.rotation.x = -Math.PI / 2;
    mainStreet1.position.y = 0.01;
    scene.add(mainStreet1);

    const mainStreet2 = new THREE.Mesh(new THREE.PlaneGeometry(100, 4), mainStreetMaterial);
    mainStreet2.rotation.x = -Math.PI / 2;
    mainStreet2.position.y = 0.01;
    scene.add(mainStreet2);

    // Secondary streets
    const secondaryMaterial = new THREE.MeshLambertMaterial({ color: secondaryStreetColor });
    [-20, -10, 10, 20].forEach(pos => {
        const street1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 100), secondaryMaterial);
        street1.rotation.x = -Math.PI / 2;
        street1.position.set(pos, 0.02, 0);
        scene.add(street1);

        const street2 = new THREE.Mesh(new THREE.PlaneGeometry(100, 2), secondaryMaterial);
        street2.rotation.x = -Math.PI / 2;
        street2.position.set(0, 0.02, pos);
        scene.add(street2);
    });

    // Parks
    const parkMaterial = new THREE.MeshLambertMaterial({
        color: isDark ? 0x0a2a0a : 0x0d4d0d
    });
    [[-15, -15], [15, -15], [-15, 15], [15, 15]].forEach(([x, z]) => {
        const park = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), parkMaterial);
        park.rotation.x = -Math.PI / 2;
        park.position.set(x, 0.03, z);
        scene.add(park);
    });
}

function createBuildings(scene: THREE.Scene, isDark: boolean) {
    const buildings = [
        // Downtown core
        { pos: [-5, -5], height: 15, width: 4, depth: 4, type: 'office' },
        { pos: [5, -5], height: 12, width: 3, depth: 5, type: 'office' },
        { pos: [-5, 5], height: 18, width: 3, depth: 3, type: 'office' },
        { pos: [5, 5], height: 14, width: 4, depth: 4, type: 'mixed' },

        // Mid-rise
        { pos: [-15, -5], height: 8, width: 3, depth: 4, type: 'mixed' },
        { pos: [15, -5], height: 10, width: 3, depth: 3, type: 'hotel' },
        { pos: [-5, -15], height: 9, width: 4, depth: 3, type: 'mixed' },
        { pos: [5, -15], height: 11, width: 3, depth: 4, type: 'office' },
        { pos: [-5, 15], height: 7, width: 3, depth: 3, type: 'mixed' },
        { pos: [5, 15], height: 9, width: 4, depth: 3, type: 'hotel' },

        // Residential
        { pos: [-25, -5], height: 6, width: 3, depth: 3, type: 'residential' },
        { pos: [25, -5], height: 5, width: 4, depth: 3, type: 'residential' },
        { pos: [-5, -25], height: 4, width: 3, depth: 4, type: 'residential' },
        { pos: [5, -25], height: 6, width: 3, depth: 3, type: 'residential' },
        { pos: [-5, 25], height: 5, width: 4, depth: 3, type: 'residential' },
        { pos: [5, 25], height: 4, width: 3, depth: 4, type: 'residential' },
    ];

    buildings.forEach(building => {
        createBuilding(scene, building.pos, building.height, building.width, building.depth, building.type, isDark);
    });
}

function createBuilding(scene: THREE.Scene, pos: number[], height: number, width: number, depth: number, type: string, isDark: boolean) {
    const buildingGroup = new THREE.Group();

    // Building colors based on type and theme
    const getBuildingColor = () => {
        const colors = {
            office: isDark ? 0x404040 : 0x696969,
            residential: isDark ? 0x5a4a35 : 0x8B7355,
            mixed: isDark ? 0x3a3a3a : 0x5A5A5A,
            hotel: isDark ? 0x708090 : 0xB0C4DE
        };
        return colors[type as keyof typeof colors] || colors.office;
    };

    const getWindowColor = () => {
        const colors = {
            office: isDark ? 0xFFD700 : 0xE0E0E0,
            residential: isDark ? 0xFFAA00 : 0xFFE135,
            mixed: isDark ? 0x4169E1 : 0x87CEEB,
            hotel: isDark ? 0xF0E68C : 0xFFF8DC
        };
        return colors[type as keyof typeof colors] || colors.office;
    };

    // Main building
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: getBuildingColor() });
    const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
    buildingMesh.position.y = height / 2;
    buildingMesh.castShadow = true;
    buildingGroup.add(buildingMesh);

    // Windows
    const windowColor = getWindowColor();
    const floors = Math.floor(height / 1.2);

    for (let floor = 0; floor < floors; floor++) {
        for (let w = 0; w < Math.floor(width); w++) {
            // Front windows
            const windowGeometry = new THREE.PlaneGeometry(0.5, 0.7);
            const windowMaterial = new THREE.MeshLambertMaterial({
                color: windowColor,
                emissive: isDark ? windowColor : 0x000000,
                emissiveIntensity: isDark ? 0.1 : 0
            });

            const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
            window1.position.set(
                w - width / 2 + 0.5,
                floor * 1.2 + 0.6,
                depth / 2 + 0.05
            );
            buildingGroup.add(window1);

            // Back windows
            const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
            window2.position.set(
                w - width / 2 + 0.5,
                floor * 1.2 + 0.6,
                -depth / 2 - 0.05
            );
            window2.rotation.y = Math.PI;
            buildingGroup.add(window2);
        }
    }

    buildingGroup.position.set(pos[0], 0, pos[1]);
    scene.add(buildingGroup);
}

function createTrees(scene: THREE.Scene, isDark: boolean) {
    const treePositions = [
        [-12, -12], [12, -12], [-12, 12], [12, 12],
        [-18, 18], [18, 18]
    ];

    treePositions.forEach(([x, z]) => {
        const treeGroup = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.2, 2, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({
            color: isDark ? 0x654321 : 0x8B4513
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Foliage
        const foliageGeometry = new THREE.SphereGeometry(1.2, 8, 6);
        const foliageMaterial = new THREE.MeshLambertMaterial({
            color: isDark ? 0x1a4a1a : 0x228B22
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 2.8;
        foliage.castShadow = true;
        treeGroup.add(foliage);

        treeGroup.position.set(x, 0, z);
        scene.add(treeGroup);
    });
}

function createStreetElements(scene: THREE.Scene, isDark: boolean) {
    // Street lamps
    const lampPositions = [
        [-22, -25], [-22, -15], [-22, -5], [-22, 5], [-22, 15], [-22, 25],
        [22, -25], [22, -15], [22, -5], [22, 5], [22, 15], [22, 25],
        [-25, -22], [-15, -22], [-5, -22], [5, -22], [15, -22], [25, -22],
        [-25, 22], [-15, 22], [-5, 22], [5, 22], [15, 22], [25, 22]
    ];

    lampPositions.forEach(([x, z]) => {
        const lampGroup = new THREE.Group();

        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.08, 5, 12);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 2.5;
        pole.castShadow = true;
        lampGroup.add(pole);

        // Lamp head
        const headGeometry = new THREE.CylinderGeometry(0.25, 0.15, 0.4, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 5.2;
        lampGroup.add(head);

        // Light bulb
        const bulbGeometry = new THREE.SphereGeometry(0.12, 12, 8);
        const bulbMaterial = new THREE.MeshLambertMaterial({
            color: 0xFFFACD,
            emissive: 0xFFFACD,
            emissiveIntensity: isDark ? 0.4 : 0.1
        });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        bulb.position.y = 4.9;
        lampGroup.add(bulb);

        // Add point light for dark mode
        if (isDark) {
            const light = new THREE.PointLight(0xFFFACD, 0.3, 15);
            light.position.y = 4.9;
            lampGroup.add(light);
        }

        lampGroup.position.set(x, 0, z);
        scene.add(lampGroup);
    });

    // Traffic lights at intersections
    const trafficLightPositions = [[-2, -2], [2, -2], [-2, 2], [2, 2]];

    trafficLightPositions.forEach(([x, z]) => {
        const trafficGroup = new THREE.Group();

        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.04, 0.06, 3, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 1.5;
        trafficGroup.add(pole);

        // Housing
        const housingGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.15);
        const housingMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const housing = new THREE.Mesh(housingGeometry, housingMaterial);
        housing.position.y = 3.2;
        trafficGroup.add(housing);

        // Lights (red, yellow, green)
        const lightColors = [0xff0000, 0xffff00, 0x00ff00];
        const lightPositions = [3.5, 3.2, 2.9];

        lightColors.forEach((color, i) => {
            const lightGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
            const lightMaterial = new THREE.MeshLambertMaterial({
                color: i === 0 ? color : 0x333333, // Only red light active
                emissive: i === 0 ? color : 0x000000,
                emissiveIntensity: i === 0 ? 0.3 : 0
            });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(0, lightPositions[i], 0.08);
            light.rotation.x = Math.PI / 2;
            trafficGroup.add(light);
        });

        trafficGroup.position.set(x, 0, z);
        scene.add(trafficGroup);
    });
}

function setupLighting(scene: THREE.Scene, isDark: boolean) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(
        isDark ? 0x404080 : 0xffffff,
        isDark ? 0.1 : 0.4
    );
    scene.add(ambientLight);

    // Directional light (sun/moon)
    const directionalLight = new THREE.DirectionalLight(
        isDark ? 0xb8c6db : 0xffffff,
        isDark ? 0.3 : 1
    );
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Additional atmospheric lighting for dark mode
    if (isDark) {
        const moonLight = new THREE.PointLight(0x4a4a8a, 0.2, 100);
        moonLight.position.set(0, 50, 0);
        scene.add(moonLight);

        const cityGlow1 = new THREE.PointLight(0x6a5a8a, 0.1, 50);
        cityGlow1.position.set(-20, 5, -20);
        scene.add(cityGlow1);

        const cityGlow2 = new THREE.PointLight(0x6a5a8a, 0.1, 50);
        cityGlow2.position.set(20, 5, 20);
        scene.add(cityGlow2);
    }
}

// UI Components
function CityUI() {
    const [time, setTime] = useState(new Date());
    const { isDark, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const bgClass = isDark
        ? "bg-gray-900 bg-opacity-80 text-white border-gray-700"
        : "bg-black bg-opacity-70 text-white";

    const panelBgClass = isDark
        ? "bg-gray-800 bg-opacity-90 text-gray-100 border border-gray-600"
        : "bg-white bg-opacity-90 text-gray-800";

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Theme toggle button */}
            <button
                onClick={toggleTheme}
                className={`absolute top-6 right-6 p-3 rounded-full ${isDark ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-yellow-300'
                    } backdrop-blur-md pointer-events-auto hover:scale-110 transition-all duration-300 shadow-lg z-10`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {isDark ? '☀️' : '🌙'}
            </button>

            {/* Top left time and weather info */}
            <div className={`absolute top-6 left-6 ${bgClass} p-4 rounded-lg backdrop-blur-md border ${isDark ? 'border-gray-600' : 'border-transparent'}`}>
                <div className="text-lg font-mono">
                    {time.toLocaleTimeString()}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-300'}`}>
                    {time.toLocaleDateString()}
                </div>
                <div className={`text-sm mt-1 ${isDark ? 'text-blue-300' : 'text-blue-300'}`}>
                    {isDark ? '🌙 18°C Clear Night' : '☀️ 24°C Clear Day'}
                </div>
            </div>

            {/* City metrics panel */}
            <div className={`absolute top-1/2 right-10 transform -translate-y-1/2 ${panelBgClass} p-4 rounded-lg pointer-events-auto backdrop-blur-md shadow-lg`}>
                <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    CITY METRICS
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>🚦 Traffic Flow:</span>
                        <span className="text-green-600 font-medium">Good</span>
                    </div>
                    <div className="flex justify-between">
                        <span>🚌 Transit:</span>
                        <span className="text-green-600 font-medium">On Time</span>
                    </div>
                    <div className="flex justify-between">
                        <span>⚡ Power Grid:</span>
                        <span className="text-green-600 font-medium">Stable</span>
                    </div>
                    <div className="flex justify-between">
                        <span>🌡️ Air Quality:</span>
                        <span className="text-yellow-600 font-medium">Moderate</span>
                    </div>
                    <div className="flex justify-between">
                        <span>👥 Population:</span>
                        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>125K</span>
                    </div>
                    <div className="flex justify-between">
                        <span>💡 Mode:</span>
                        <span className={`font-medium ${isDark ? 'text-blue-400' : 'text-orange-600'}`}>
                            {isDark ? 'Night' : 'Day'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom status bar */}
            <div className={`absolute bottom-6 left-6 right-6 ${panelBgClass} p-3 rounded-lg backdrop-blur-md shadow-lg`}>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex space-x-6">
                        <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            System Online
                        </span>
                        <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {isDark ? 'Night Vision Active' : 'Daylight Sensors Active'}
                        </span>
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Smart City Dashboard v2.1
                    </div>
                </div>
            </div>

            {/* Controls hint */}
            <div className={`absolute bottom-20 left-6 ${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                🖱️ Click and drag to rotate • Scroll to zoom
            </div>
        </div>
    );
}

// Main component
export default function RealisticSmartCity() {
    return (
        <ThemeProvider>
            <CityContent />
        </ThemeProvider>
    );
}

function CityContent() {
    const { isDark } = useContext(ThemeContext);

    const backgroundClass = isDark
        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-b from-blue-100 via-blue-50 to-gray-100";

    return (
        <div className={`w-full h-screen ${backgroundClass} relative overflow-hidden`}>
            <ThreeScene />
            <CityUI />
        </div>
    );
}