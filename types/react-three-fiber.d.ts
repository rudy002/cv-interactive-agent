declare module "@react-three/fiber" {
  import * as React from "react";

  // Typage léger pour éviter les erreurs ESLint/TS avec la beta R3F + React 19
  export const Canvas: React.ComponentType<any>;
  export type ThreeElements = JSX.IntrinsicElements;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any;
      group: any;
      ambientLight: any;
      directionalLight: any;
      [key: string]: any;
    }
  }
}

export {};

