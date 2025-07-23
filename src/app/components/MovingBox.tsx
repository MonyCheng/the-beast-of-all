'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function MovingBox() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}
