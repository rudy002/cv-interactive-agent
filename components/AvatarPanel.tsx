"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";

// Chemin local du modèle Ready Player Me
const MODEL_URL = "/models/rudy2_readyplayerme.glb";

export interface AvatarPanelProps {
  isSpeaking?: boolean;
}

function AvatarModel({ isSpeaking = false }: AvatarPanelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const mouthBlendShapes = useRef<{ 
    mesh: THREE.SkinnedMesh; 
    index: number; 
    name: string;
  }[]>([]);
  const speakingTime = useRef(0);

  // Activer les ombres et trouver les blendshapes de la bouche
  useEffect(() => {
    let totalBlendshapesFound = 0;
    
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        
        // Chercher les blendshapes de la bouche (mouthOpen et mouthSmile)
        if (obj.morphTargetDictionary && obj.morphTargetInfluences) {
          const mouthShapes = ['mouthOpen', 'mouthSmile'];
          
          mouthShapes.forEach((shapeName) => {
            const index = obj.morphTargetDictionary[shapeName];
            if (index !== undefined) {
              mouthBlendShapes.current.push({ 
                mesh: obj, 
                index,
                name: shapeName
              });
              totalBlendshapesFound++;
            }
          });
        }
      }
    });
    
    if (totalBlendshapesFound > 0) {
      console.log(`✅ Synchronisation labiale activée : ${totalBlendshapesFound} blendshapes trouvés`);
    } else {
      console.log("⚠️ Aucun blendshape de bouche trouvé - l'animation de bouche ne fonctionnera pas");
    }
  }, [scene]);

  // Animation idle + synchronisation labiale
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!group.current) return;

    // Animation idle (rotation + léger up/down)
    group.current.rotation.y = Math.sin(t * 0.4) * 0.25;
    group.current.position.y = -1.1 + 0.03 * Math.sin(t * 2);

    // Animation de la bouche pendant la parole
    if (isSpeaking) {
      speakingTime.current += state.clock.getDelta();
      
      // Créer un pattern d'animation de bouche réaliste
      const baseFrequency = 8;
      const variationFrequency = 12;
      
      const mouthOpenValue = Math.abs(Math.sin(speakingTime.current * baseFrequency)) * 0.7;
      const mouthSmileValue = Math.abs(Math.sin(speakingTime.current * variationFrequency)) * 0.2;
      
      // Appliquer aux blendshapes trouvés
      mouthBlendShapes.current.forEach(({ mesh, index, name }) => {
        if (mesh.morphTargetInfluences) {
          if (name === 'mouthOpen') {
            mesh.morphTargetInfluences[index] = mouthOpenValue;
          } else if (name === 'mouthSmile') {
            mesh.morphTargetInfluences[index] = mouthSmileValue;
          }
        }
      });
    } else {
      // Réinitialiser la bouche quand on ne parle pas
      speakingTime.current = 0;
      mouthBlendShapes.current.forEach(({ mesh, index }) => {
        if (mesh.morphTargetInfluences) {
          mesh.morphTargetInfluences[index] = 0;
        }
      });
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

export function AvatarPanel({ isSpeaking = false }: AvatarPanelProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 25 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[2, 4, 3]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={null}>
          <AvatarModel isSpeaking={isSpeaking} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Précharger le modèle
useGLTF.preload(MODEL_URL);
