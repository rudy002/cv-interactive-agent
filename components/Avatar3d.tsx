"use client";

import { Suspense } from "react";
// @ts-expect-error Canvas types non exposés dans la beta R3F + React 19
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, useProgress } from "@react-three/drei";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      primitive: any;
    }
  }
}

function AvatarModel() {
  const { scene } = useGLTF("/models/avatar3D.glb");
  scene.position.set(0, -0.55, 0);
  scene.scale.set(1.1, 1.1, 1.1);
  return (
    // @ts-expect-error R3F intrinsic types not picked with React 19
    <primitive object={scene} dispose={null} />
  );
}

function LoadingOverlay() {
  const { active } = useProgress();
  if (!active) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-200/80 dark:text-zinc-100/80 bg-black/30 backdrop-blur-sm">
      Chargement du modèle…
    </div>
  );
}

useGLTF.preload("/models/avatar3D.glb");

export default function Avatar3d() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-[640px] aspect-[3/4] sm:aspect-square">
        <Canvas
          camera={{ position: [0, 1.85, 1.8], fov: 24 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          {/* @ts-expect-error R3F intrinsic element not picked up with React 19 types */}
          <ambientLight intensity={0.6} />
          {/* @ts-expect-error R3F intrinsic element not picked up with React 19 types */}
          <directionalLight intensity={0.9} position={[2, 3, 2]} />

          <Suspense fallback={null}>
            <Stage
              adjustCamera={false}
              intensity={0.8}
              environment="city"
              shadows="contact"
            >
              <AvatarModel />
            </Stage>
          </Suspense>

          {/* La caméra regarde le visage */}
          <OrbitControls
            target={[0, 1.55, 0]}
            enableRotate={false}
            enablePan={false}
            enableZoom={false}
          />
        </Canvas>

        <LoadingOverlay />
      </div>
    </div>
  );
}

