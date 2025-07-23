'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Realistic ground with streets and parks
function CityGround() {
    const groundRef = useRef<THREE.Mesh>(null);

    return (
        <group>
            {/* Main ground */}
            <mesh
                ref={groundRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.1, 0]}
            >
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>

            {/* Streets */}
            {/* Main boulevard */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
            >
                <planeGeometry args={[4, 100]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
            >
                <planeGeometry args={[100, 4]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Secondary streets */}
            {[-20, -10, 10, 20].map((pos, i) => (
                <group key={i}>
                    <mesh
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[pos, 0.01, 0]}
                    >
                        <planeGeometry args={[2, 100]} />
                        <meshStandardMaterial color="#333333" />
                    </mesh>
                    <mesh
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, 0.01, pos]}
                    >
                        <planeGeometry args={[100, 2]} />
                        <meshStandardMaterial color="#333333" />
                    </mesh>
                </group>
            ))}

            {/* Sidewalks */}
            {[-21, -19, -11, -9, 9, 11, 19, 21].map((pos, i) => (
                <group key={i}>
                    <mesh
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[pos, 0.02, 0]}
                    >
                        <planeGeometry args={[1, 100]} />
                        <meshStandardMaterial color="#444444" />
                    </mesh>
                    <mesh
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, 0.02, pos]}
                    >
                        <planeGeometry args={[100, 1]} />
                        <meshStandardMaterial color="#444444" />
                    </mesh>
                </group>
            ))}

            {/* Small parks */}
            {[
                [-15, -15], [15, -15], [-15, 15], [15, 15]
            ].map(([x, z], i) => (
                <mesh
                    key={i}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[x, 0.03, z]}
                >
                    <planeGeometry args={[6, 6]} />
                    <meshStandardMaterial color="#0d4d0d" />
                </mesh>
            ))}
        </group>
    );
}

// Realistic tree with detailed geometry
function RealisticTree({ position, scale = 1 }: {
    position: [number, number, number];
    scale?: number;
}) {
    const treeRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (treeRef.current) {
            const time = state.clock.elapsedTime;
            // Gentle swaying animation
            treeRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
        }
    });

    return (
        <group ref={treeRef} position={position} scale={scale}>
            <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[0.1, 0.2, 2, 8]} />
                <meshStandardMaterial color="#8B4513" roughness={0.9} />
            </mesh>

            {/* Trunk texture detail */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.18, 0.22, 1, 8]} />
                <meshStandardMaterial color="#654321" roughness={0.9} />
            </mesh>

            {/* Main foliage - multiple layers for realism */}
            <mesh position={[0, 2.8, 0]}>
                <sphereGeometry args={[1.2, 8, 6]} />
                <meshStandardMaterial color="#228B22" roughness={0.8} />
            </mesh>

            {/* Secondary foliage layers */}
            <mesh position={[0.3, 2.4, 0.2]}>
                <sphereGeometry args={[0.8, 8, 6]} />
                <meshStandardMaterial color="#32CD32" roughness={0.8} />
            </mesh>
            <mesh position={[-0.2, 2.6, -0.3]}>
                <sphereGeometry args={[0.9, 8, 6]} />
                <meshStandardMaterial color="#2E8B57" roughness={0.8} />
            </mesh>

            {/* Small branches */}
            {Array.from({ length: 6 }, (_, i) => {
                const angle = (i * Math.PI * 2) / 6;
                const x = Math.cos(angle) * 0.8;
                const z = Math.sin(angle) * 0.8;
                return (
                    <mesh key={i} position={[x, 2.2, z]} rotation={[0, angle, Math.PI / 6]}>
                        <cylinderGeometry args={[0.02, 0.04, 0.6, 6]} />
                        <meshStandardMaterial color="#8B4513" />
                    </mesh>
                );
            })}
        </group>
    );
}

// Detailed building with realistic architecture
function DetailedBuilding({
    position,
    height = 8,
    width = 3,
    depth = 3,
    type = 'office',
    hasBalconies = false
}: {
    position: [number, number, number];
    height?: number;
    width?: number;
    depth?: number;
    type?: 'office' | 'residential' | 'mixed' | 'hotel';
    hasBalconies?: boolean;
}) {
    const buildingRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    const getBuildingProps = () => {
        switch (type) {
            case 'residential':
                return {
                    color: '#8B7355',
                    windowColor: '#FFE135',
                    roofColor: '#654321'
                };
            case 'mixed':
                return {
                    color: '#5A5A5A',
                    windowColor: '#87CEEB',
                    roofColor: '#4A4A4A'
                };
            case 'hotel':
                return {
                    color: '#B0C4DE',
                    windowColor: '#FFF8DC',
                    roofColor: '#778899'
                };
            default:
                return {
                    color: '#696969',
                    windowColor: '#E0E0E0',
                    roofColor: '#2F4F4F'
                };
        }
    };

    const { color, windowColor, roofColor } = getBuildingProps();
    const floors = Math.floor(height / 1.2);

    return (
        <group ref={buildingRef} position={position}>
            {/* Building foundation */}
            <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[width + 0.4, 0.4, depth + 0.4]} />
                <meshStandardMaterial color="#444444" roughness={0.9} />
            </mesh>

            {/* Main building structure */}
            <mesh
                position={[0, height / 2, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.01 : 1}
            >
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    color={hovered ? '#87CEEB' : color}
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>

            {/* Detailed roof structure */}
            <mesh position={[0, height + 0.1, 0]}>
                <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
                <meshStandardMaterial color={roofColor} roughness={0.8} />
            </mesh>

            {/* Roof details - AC units, vents */}
            <mesh position={[width / 3, height + 0.3, 0]}>
                <boxGeometry args={[0.6, 0.4, 0.8]} />
                <meshStandardMaterial color="#666666" />
            </mesh>
            <mesh position={[-width / 3, height + 0.25, depth / 3]}>
                <cylinderGeometry args={[0.15, 0.15, 0.5, 8]} />
                <meshStandardMaterial color="#888888" />
            </mesh>

            {/* Window details with frames */}
            {Array.from({ length: floors }, (_, floor) => (
                <group key={floor}>
                    {/* Window rows */}
                    {Array.from({ length: Math.floor(width) }, (_, w) => (
                        <group key={w}>
                            {/* Front windows */}
                            <mesh position={[w - width / 2 + 0.5, floor * 1.2 + 0.6, depth / 2 + 0.02]}>
                                <boxGeometry args={[0.6, 0.8, 0.04]} />
                                <meshStandardMaterial color="#2a2a2a" />
                            </mesh>
                            <mesh position={[w - width / 2 + 0.5, floor * 1.2 + 0.6, depth / 2 + 0.04]}>
                                <boxGeometry args={[0.5, 0.7, 0.02]} />
                                <meshStandardMaterial
                                    color={windowColor}
                                    emissive={type === 'residential' ? '#332200' : '#001122'}
                                    emissiveIntensity={0.1}
                                    transparent
                                    opacity={0.7}
                                />
                            </mesh>

                            {/* Back windows */}
                            <mesh position={[w - width / 2 + 0.5, floor * 1.2 + 0.6, -depth / 2 - 0.02]}>
                                <boxGeometry args={[0.6, 0.8, 0.04]} />
                                <meshStandardMaterial color="#2a2a2a" />
                            </mesh>
                            <mesh position={[w - width / 2 + 0.5, floor * 1.2 + 0.6, -depth / 2 - 0.04]}>
                                <boxGeometry args={[0.5, 0.7, 0.02]} />
                                <meshStandardMaterial
                                    color={windowColor}
                                    emissive={type === 'residential' ? '#332200' : '#001122'}
                                    emissiveIntensity={0.1}
                                    transparent
                                    opacity={0.7}
                                />
                            </mesh>
                        </group>
                    ))}

                    {/* Balconies for residential buildings */}
                    {hasBalconies && type === 'residential' && floor > 0 && (
                        <group>
                            <mesh position={[0, floor * 1.2 + 0.1, depth / 2 + 0.4]}>
                                <boxGeometry args={[width * 0.8, 0.1, 0.8]} />
                                <meshStandardMaterial color="#8B7355" />
                            </mesh>
                            {/* Balcony railing */}
                            <mesh position={[0, floor * 1.2 + 0.5, depth / 2 + 0.75]}>
                                <boxGeometry args={[width * 0.8, 0.8, 0.05]} />
                                <meshStandardMaterial color="#2a2a2a" transparent opacity={0.8} />
                            </mesh>
                        </group>
                    )}
                </group>
            ))}

            {/* Ground floor entrance */}
            {type === 'office' && (
                <group>
                    <mesh position={[0, 0.8, depth / 2 + 0.05]}>
                        <boxGeometry args={[1.4, 1.8, 0.1]} />
                        <meshStandardMaterial color="#1a1a1a" />
                    </mesh>
                    {/* Door handles */}
                    <mesh position={[0.3, 0.8, depth / 2 + 0.11]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} />
                    </mesh>
                    <mesh position={[-0.3, 0.8, depth / 2 + 0.11]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} />
                    </mesh>
                </group>
            )}
        </group>
    );
}

// Realistic street lamp
function StreetLamp({ position }: { position: [number, number, number] }) {
    const lampRef = useRef<THREE.Group>(null);

    return (
        <group ref={lampRef} position={position}>
            {/* Lamp post base */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 0.2, 8]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Main pole */}
            <mesh position={[0, 2.5, 0]}>
                <cylinderGeometry args={[0.05, 0.08, 5, 12]} />
                <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.4} />
            </mesh>

            {/* Lamp head */}
            <mesh position={[0, 5.2, 0]}>
                <cylinderGeometry args={[0.25, 0.15, 0.4, 8]} />
                <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Light bulb/LED */}
            <mesh position={[0, 4.9, 0]}>
                <sphereGeometry args={[0.12, 12, 8]} />
                <meshStandardMaterial
                    color="#FFFACD"
                    emissive="#FFFACD"
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Decorative elements */}
            <mesh position={[0, 3, 0]}>
                <torusGeometry args={[0.12, 0.02, 8, 16]} />
                <meshStandardMaterial color="#444444" metalness={0.8} />
            </mesh>
        </group>
    );
}

// Realistic bench
function ParkBench({ position, rotation = [0, 0, 0] }: {
    position: [number, number, number];
    rotation?: [number, number, number];
}) {
    return (
        <group position={position} rotation={rotation}>
            {/* Bench seat */}
            <mesh position={[0, 0.35, 0]}>
                <boxGeometry args={[1.5, 0.08, 0.4]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
            </mesh>

            {/* Bench back */}
            <mesh position={[0, 0.7, -0.15]} rotation={[0.1, 0, 0]}>
                <boxGeometry args={[1.5, 0.6, 0.08]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
            </mesh>

            {/* Bench legs */}
            {[
                [-0.6, 0.15, 0.1], [0.6, 0.15, 0.1],
                [-0.6, 0.15, -0.1], [0.6, 0.15, -0.1]
            ].map(([x, y, z], i) => (
                <mesh key={i} position={[x, y, z]}>
                    <boxGeometry args={[0.08, 0.3, 0.08]} />
                    <meshStandardMaterial color="#654321" />
                </mesh>
            ))}

            {/* Metal support frame */}
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[1.4, 0.04, 0.3]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.8} />
            </mesh>
        </group>
    );
}

// Traffic light with realistic design
function TrafficLight({ position }: { position: [number, number, number] }) {
    const lightRef = useRef<THREE.Group>(null);
    const [currentLight, setCurrentLight] = useState(0); // 0: red, 1: yellow, 2: green

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLight(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <group ref={lightRef} position={position}>
            {/* Pole */}
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.04, 0.06, 3, 8]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.8} />
            </mesh>

            {/* Traffic light housing */}
            <mesh position={[0, 3.2, 0]}>
                <boxGeometry args={[0.25, 0.8, 0.15]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Light lenses */}
            {/* Red light */}
            <mesh position={[0, 3.5, 0.08]}>
                <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
                <meshStandardMaterial
                    color={currentLight === 0 ? "#ff0000" : "#330000"}
                    emissive={currentLight === 0 ? "#ff0000" : "#000000"}
                    emissiveIntensity={currentLight === 0 ? 0.5 : 0}
                />
            </mesh>

            {/* Yellow light */}
            <mesh position={[0, 3.2, 0.08]}>
                <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
                <meshStandardMaterial
                    color={currentLight === 1 ? "#ffff00" : "#333300"}
                    emissive={currentLight === 1 ? "#ffff00" : "#000000"}
                    emissiveIntensity={currentLight === 1 ? 0.5 : 0}
                />
            </mesh>

            {/* Green light */}
            <mesh position={[0, 2.9, 0.08]}>
                <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
                <meshStandardMaterial
                    color={currentLight === 2 ? "#00ff00" : "#003300"}
                    emissive={currentLight === 2 ? "#00ff00" : "#000000"}
                    emissiveIntensity={currentLight === 2 ? 0.5 : 0}
                />
            </mesh>

            {/* Hood/visor */}
            <mesh position={[0, 3.6, 0.05]}>
                <boxGeometry args={[0.3, 0.05, 0.2]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
        </group>
    );
}

// Street elements with realistic objects
function StreetElements() {
    return (
        <group>
            {/* Street lights */}
            {[
                [-22, 0, -25], [-22, 0, -15], [-22, 0, -5], [-22, 0, 5], [-22, 0, 15], [-22, 0, 25],
                [22, 0, -25], [22, 0, -15], [22, 0, -5], [22, 0, 5], [22, 0, 15], [22, 0, 25],
                [-25, 0, -22], [-15, 0, -22], [-5, 0, -22], [5, 0, -22], [15, 0, -22], [25, 0, -22],
                [-25, 0, 22], [-15, 0, 22], [-5, 0, 22], [5, 0, 22], [15, 0, 22], [25, 0, 22]
            ].map(([x, y, z], i) => (
                <StreetLamp key={i} position={[x, y, z]} />
            ))}

            {/* Traffic lights at major intersections */}
            {[
                [-2, 0, -2], [2, 0, -2], [-2, 0, 2], [2, 0, 2]
            ].map(([x, y, z], i) => (
                <TrafficLight key={i} position={[x, y, z]} />
            ))}
            {[
                [-16, 0, -14], [-14, 0, -16],
                [16, 0, -14], [14, 0, -16],
                [-16, 0, 14], [-14, 0, 16],
                [16, 0, 14], [14, 0, 16]
            ].map(([x, y, z], i) => (
                <ParkBench key={i} position={[x, y, z]} rotation={[0, i * Math.PI / 4, 0]} />
            ))}
        </group>
    );
}

// Main 3D scene
function Scene() {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(30, 20, 30);
    }, [camera]);

    return (
        <>
            {/* Realistic lighting */}
            <ambientLight intensity={0.4} color="#ffffff" />
            <directionalLight
                position={[20, 30, 20]}
                intensity={1}
                color="#ffffff"
                castShadow
            />
            <pointLight position={[0, 10, 0]} color="#ffffe0" intensity={0.3} />

            {/* Environment */}
            <CityGround />
            <StreetElements />

            {/* Buildings arranged in realistic city blocks */}

            {/* Downtown core - taller office buildings */}
            <DetailedBuilding position={[-5, 0, -5]} height={15} width={4} depth={4} type="office" />
            <DetailedBuilding position={[5, 0, -5]} height={12} width={3} depth={5} type="office" />
            <DetailedBuilding position={[-5, 0, 5]} height={18} width={3} depth={3} type="office" />
            <DetailedBuilding position={[5, 0, 5]} height={14} width={4} depth={4} type="mixed" />

            {/* Mid-rise mixed use */}
            <DetailedBuilding position={[-15, 0, -5]} height={8} width={3} depth={4} type="mixed" />
            <DetailedBuilding position={[15, 0, -5]} height={10} width={3} depth={3} type="hotel" />
            <DetailedBuilding position={[-5, 0, -15]} height={9} width={4} depth={3} type="mixed" />
            <DetailedBuilding position={[5, 0, -15]} height={11} width={3} depth={4} type="office" />
            <DetailedBuilding position={[-5, 0, 15]} height={7} width={3} depth={3} type="mixed" />
            <DetailedBuilding position={[5, 0, 15]} height={9} width={4} depth={3} type="hotel" />

            {/* Residential areas */}
            <DetailedBuilding position={[-25, 0, -5]} height={6} width={3} depth={3} type="residential" hasBalconies={true} />
            <DetailedBuilding position={[25, 0, -5]} height={5} width={4} depth={3} type="residential" hasBalconies={true} />
            <DetailedBuilding position={[-5, 0, -25]} height={4} width={3} depth={4} type="residential" />
            <DetailedBuilding position={[5, 0, -25]} height={6} width={3} depth={3} type="residential" hasBalconies={true} />
            <DetailedBuilding position={[-5, 0, 25]} height={5} width={4} depth={3} type="residential" />
            <DetailedBuilding position={[5, 0, 25]} height={4} width={3} depth={4} type="residential" hasBalconies={true} />

            {/* Corner buildings */}
            <DetailedBuilding position={[-25, 0, -25]} height={3} width={2} depth={3} type="residential" />
            <DetailedBuilding position={[25, 0, -25]} height={4} width={3} depth={2} type="mixed" />
            <DetailedBuilding position={[-25, 0, 25]} height={3} width={3} depth={3} type="residential" />
            <DetailedBuilding position={[25, 0, 25]} height={5} width={2} depth={3} type="mixed" />

            {/* Additional mid-density buildings */}
            <DetailedBuilding position={[-15, 0, -15]} height={7} width={3} depth={3} type="office" />
            <DetailedBuilding position={[15, 0, -15]} height={8} width={3} depth={4} type="mixed" />
            <DetailedBuilding position={[-15, 0, 15]} height={6} width={4} depth={3} type="residential" hasBalconies={true} />
            <DetailedBuilding position={[15, 0, 15]} height={7} width={3} depth={3} type="hotel" />

            {/* Small commercial buildings */}
            <DetailedBuilding position={[-25, 0, -15]} height={2} width={3} depth={2} type="mixed" />
            <DetailedBuilding position={[25, 0, -15]} height={3} width={2} depth={3} type="mixed" />
            <DetailedBuilding position={[-25, 0, 15]} height={2} width={2} depth={3} type="mixed" />
            <DetailedBuilding position={[25, 0, 15]} height={3} width={3} depth={2} type="mixed" />

            {/* Trees scattered around the city */}
            <RealisticTree position={[-12, 0, -12]} scale={0.8} />
            <RealisticTree position={[12, 0, -12]} scale={1.2} />
            <RealisticTree position={[-12, 0, 12]} scale={1.0} />
            <RealisticTree position={[12, 0, 12]} scale={0.9} />
            <RealisticTree position={[-18, 0, 18]} scale={1.1} />
            <RealisticTree position={[18, 0, 18]} scale={0.7} />
        </>
    );
}

// Realistic UI overlay
function CityUI() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Top left time and weather info */}
            <div className="absolute top-6 left-6 bg-black bg-opacity-70 text-white p-4 rounded-lg backdrop-blur-md">
                <div className="text-lg font-mono">
                    {time.toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-300">
                    {time.toLocaleDateString()}
                </div>
                <div className="text-sm text-blue-300 mt-1">
                    ☀️ 24°C Clear
                </div>
            </div>

            {/* City metrics panel */}
            <div className="absolute top-1/2 right-10 transform -translate-y-1/2 bg-white bg-opacity-90 p-4 rounded-lg text-gray-800 pointer-events-auto backdrop-blur-md shadow-lg">
                <h3 className="text-sm font-semibold mb-3 text-gray-600">CITY METRICS</h3>
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
                        <span className="text-gray-700 font-medium">125K</span>
                    </div>
                </div>
            </div>

            {/* Bottom status bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
                <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-lg p-3 text-white">
                    <div className="flex justify-between items-center text-sm">
                        <span>🏙️ Mixed-Use Development</span>
                        <span>🌳 30% Green Space</span>
                        <span>🚶‍♂️ Walkable Design</span>
                        <span>🚗 Smart Traffic</span>
                        <span>📡 Connected Infrastructure</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main component
export default function RealisticSmartCity() {
    return (
        <div className="w-full h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-gray-100 relative overflow-hidden">
            <Canvas
                camera={{ position: [30, 20, 30], fov: 60 }}
                gl={{ antialias: true, alpha: false }}
                shadows
            >
                <Scene />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    maxPolarAngle={Math.PI / 2.2}
                    minDistance={15}
                    maxDistance={80}
                    target={[0, 0, 0]}
                />
            </Canvas>
            <CityUI />
        </div>
    );
}