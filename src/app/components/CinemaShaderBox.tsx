// import React, { useRef } from 'react'
// import { useFrame, extend } from '@react-three/fiber'
// import { shaderMaterial } from '@react-three/drei'
// import * as THREE from 'three'

// // Step 1: Define your shader material with uniforms and shaders
// const CinemaShaderMaterial = shaderMaterial(
//     // uniforms
//     { time: 0 },

//     // vertex shader code
//     `
//   varying vec2 vUv;

//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
//   `,

//     // fragment shader code
//     `
//   uniform float time;
//   varying vec2 vUv;

//   void main() {
//     vec3 color = vec3(vUv.x, vUv.y, 0.5 + 0.5 * sin(time));
//     gl_FragColor = vec4(color, 1.0);
//   }
//   `
// )

// // Step 2: Tell React Three Fiber about this material
// extend({ CinemaShaderMaterial })

// // Step 3: Create the mesh component using the custom shader
// export default function CinemaShaderBox() {
//     const ref = useRef<THREE.ShaderMaterial>(null)

//     // Animate the time uniform every frame
//     useFrame(({ clock }) => {
//         if (ref.current) {
//             ref.current.uniforms.time.value = clock.elapsedTime
//         }
//     })

//     return (
//         <mesh>
//             <boxGeometry args={[2, 2, 2]} />
//             {/* @ts-ignore */}
//             <cinemaShaderMaterial ref={ref} />
//         </mesh>
//     )
// }
