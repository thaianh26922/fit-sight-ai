// src/components/BodyModel.tsx
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

const BodyModel = () => {

  return (
    <Suspense fallback={null}>
      <Canvas style={{ height: 500 }}>
        <PerspectiveCamera makeDefault position={[0, 1, 3]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </Suspense>
  );
};

export default BodyModel;
