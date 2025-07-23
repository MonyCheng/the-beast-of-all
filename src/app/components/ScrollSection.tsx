// import { Canvas } from "@react-three/fiber";
// import { ReactNode } from "react";
// import MovingBox from "./MovingBox";

// interface Props {
//     children: ReactNode;
//     className?: string;
// }

// export default function ScrollSection({ children, className = '' }: Props) {
//     return (
//         <section className={`min-h-screen flex items-center justify-center p-10 ${className}`}>
//             <div className="w-full h-[400px]">
//                 <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
//                     <ambientLight intensity={0.5} />
//                     <pointLight position={[10, 10, 10]} />
//                     <MovingBox />
//                 </Canvas>
//             </div>
//             {children}
//         </section>
//     );
// }

