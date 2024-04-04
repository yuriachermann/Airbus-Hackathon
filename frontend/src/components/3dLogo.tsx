import React, { useRef, useEffect } from "react";
import type * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, PerspectiveCamera } from "@react-three/drei";

const GLTFModel = ({file}: {file: string}) => {
  const gltfRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // gltfRef.current?.rotation.set(
    //   Math.cos(t / 4) / 2,
    //   Math.sin(t / 4) / 2,
    //   -0.2 - (1 + Math.sin(t / 3)) / 24
    // );
    if (gltfRef.current)
      gltfRef.current.position.y = (1 + Math.sin(t / 0.5)) / 10;
  });

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(`${file}.glb`, (gltf) => {
      if (gltfRef.current) {
        gltfRef.current.add(gltf.scene);
      }
    });
  }, []);

  return <group ref={gltfRef} />;
};

const Logo = ({ fov, file }: { fov: number; file: string }) => {
  const cameraRef = useRef<null>(null);

  return (
    <Canvas className="h-full w-full">
      <ambientLight intensity={0.7} />
      <spotLight
        intensity={0.5}
        angle={0.1}
        penumbra={1}
        position={[10, 15, 10]}
      />
      <GLTFModel file={file} />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={fov}
        near={0.1}
        far={1000}
        position={[100, 0, 0]}
      />
      <ContactShadows
        position={[5, 5, 5]}
        opacity={0.25}
        scale={10}
        blur={1.5}
        far={0.8}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={true}
        enableRotate={true}
        autoRotate={false}
        enableDamping={true}
        // minAzimuthAngle={Math.PI * 35 / 180}
        // maxAzimuthAngle={Math.PI * 55 / 180}
        // minPolarAngle={Math.PI * 35 / 180}
        // maxPolarAngle={Math.PI * 55 / 180}
        minDistance={1}
        maxDistance={30}
        dampingFactor={1}
        panSpeed={0.01}
        rotateSpeed={0.02}
      />
    </Canvas>
  );
};

export default Logo;
