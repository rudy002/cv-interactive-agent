"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      primitive: any;
    }
  }
}

interface AvatarModelProps {
  expressions?: Record<string, number>;
}

function AvatarModel({ expressions = {} }: AvatarModelProps) {
  const { scene: originalScene } = useGLTF("/models/rudy_avatar.glb");
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Cloner la scène pour éviter les problèmes de partage
  const scene = useMemo(() => {
    if (!originalScene) return null;
    
    const cloned = originalScene.clone();
    
    // Calculer la bounding box pour centrer et ajuster la taille
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Centrer le modèle
    cloned.position.set(-center.x, -center.y, -center.z);
    
    // Ajuster l'échelle pour que le modèle soit visible (hauteur ~2 unités)
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = maxDimension > 0 ? 2 / maxDimension : 1;
    cloned.scale.set(scale, scale, scale);
    
    // Centrer à l'origine après le scale
    const boxAfterScale = new THREE.Box3().setFromObject(cloned);
    const centerAfterScale = boxAfterScale.getCenter(new THREE.Vector3());
    cloned.position.set(-centerAfterScale.x, -centerAfterScale.y, -centerAfterScale.z);
    
    // Ajuster la position verticale de l'avatar (remonter)
    cloned.position.y += 0.4; // Augmenter pour remonter l'avatar
    
    // Corriger l'inclinaison de la tête (légèrement vers l'avant)
    
    return cloned;
  }, [originalScene]);

  if (!scene) return null;

  // Appliquer les expressions faciales
  useEffect(() => {
    if (!scene || Object.keys(expressions).length === 0) return;

    const updateExpressions = () => {
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
          const mesh = child as THREE.Mesh & { 
            morphTargetInfluences: number[];
            morphTargetDictionary?: Record<string, number>;
          };
          
          if (mesh.morphTargetDictionary) {
            Object.entries(expressions).forEach(([name, value]) => {
              const index = mesh.morphTargetDictionary?.[name];
              if (index !== undefined && mesh.morphTargetInfluences) {
                mesh.morphTargetInfluences[index] = value;
              }
            });
          }
        }
      });
    };

    // Animation fluide des expressions
    const animate = () => {
      if (scene) {
        scene.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
            const mesh = child as THREE.Mesh & { 
              morphTargetInfluences: number[];
              morphTargetDictionary?: Record<string, number>;
            };
            if (mesh.morphTargetDictionary) {
              Object.entries(expressions).forEach(([name, targetValue]) => {
                const index = mesh.morphTargetDictionary?.[name];
                if (index !== undefined && mesh.morphTargetInfluences) {
                  const current = mesh.morphTargetInfluences[index] || 0;
                  // Interpolation douce vers la valeur cible
                  mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(current, targetValue, 0.1);
                }
              });
            }
          }
        });
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    updateExpressions();
    
    // Démarrer l'animation seulement s'il y a des expressions
    if (Object.keys(expressions).length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scene, expressions]);

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

useGLTF.preload("/models/rudy_avatar.glb");

/**
 * Props pour le composant Avatar3d
 * @param expressions - Objet contenant les noms des morph targets et leurs valeurs (0-1)
 * 
 * Exemple d'utilisation :
 * <Avatar3d expressions={{
 *   "eyeBlinkLeft": 0.5,
 *   "eyeBlinkRight": 0.5,
 *   "jawOpen": 0.3,
 *   "mouthSmile": 0.8
 * }} />
 * 
 * Les noms des expressions dépendent de ceux définis dans votre modèle GLB.
 * Les valeurs vont de 0 (neutre) à 1 (expression maximale).
 */
interface Avatar3dProps {
  expressions?: Record<string, number>;
}

export default function Avatar3d({ expressions }: Avatar3dProps = { expressions: {} }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-[640px] aspect-[3/4] sm:aspect-square">
        <Canvas
          camera={{ 
            position: [0, 1.6, 2.5], 
            fov: 30
          }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          onCreated={({ camera }: { camera: THREE.PerspectiveCamera }) => {
            camera.lookAt(0, 1.8, 0); // Ajusté pour suivre l'avatar qui monte
            camera.updateProjectionMatrix();
          }}
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
              <AvatarModel expressions={expressions} />
            </Stage>
          </Suspense>
        </Canvas>

        <LoadingOverlay />
      </div>
    </div>
  );
}

